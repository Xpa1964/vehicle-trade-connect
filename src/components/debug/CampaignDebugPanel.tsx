import React, { useEffect, useRef, useState } from 'react';

const CampaignDebugPanel: React.FC = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const originalLog = console.log;
    const originalError = console.error;
    const originalWarn = console.warn;

    const capture = (level: string, args: any[]) => {
      const first = typeof args[0] === 'string' ? args[0] : '';
      if (!first.includes('[CampaignTracking]')) return;

      const timestamp = new Date().toISOString().slice(11, 23);
      const parts = args.map(a =>
        typeof a === 'object' ? JSON.stringify(a, null, 0) : String(a)
      );
      setLogs(prev => [...prev, `[${timestamp}] ${level} ${parts.join(' ')}`]);
    };

    console.log = (...args: any[]) => {
      capture('LOG', args);
      originalLog.apply(console, args);
    };
    console.error = (...args: any[]) => {
      capture('ERR', args);
      originalError.apply(console, args);
    };
    console.warn = (...args: any[]) => {
      capture('WRN', args);
      originalWarn.apply(console, args);
    };

    return () => {
      console.log = originalLog;
      console.error = originalError;
      console.warn = originalWarn;
    };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  if (logs.length === 0) {
    return (
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 99999,
        background: '#000', color: '#0f0', padding: '8px 12px',
        fontFamily: 'monospace', fontSize: '11px',
        maxHeight: '120px', overflow: 'auto',
        borderTop: '2px solid #0f0',
      }}>
        ⏳ Waiting for [CampaignTracking] logs...
      </div>
    );
  }

  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 99999,
      background: '#000', color: '#0f0', padding: '8px 12px',
      fontFamily: 'monospace', fontSize: '11px',
      maxHeight: '40vh', overflow: 'auto',
      borderTop: '2px solid #0f0',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <strong>🔍 Campaign Debug ({logs.length} events)</strong>
        <button onClick={() => setLogs([])} style={{ color: '#f00', background: 'none', border: '1px solid #f00', cursor: 'pointer', fontSize: '10px', padding: '1px 6px' }}>CLEAR</button>
      </div>
      {logs.map((log, i) => (
        <div key={i} style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all', color: log.includes('ERR') ? '#f44' : log.includes('WRN') ? '#ff0' : '#0f0' }}>
          {log}
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
};

export default CampaignDebugPanel;
