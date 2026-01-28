
import { useState, useCallback, useEffect } from 'react';

interface AudioSession {
  isActive: boolean;
  language: string;
  languageName: string;
  startTime: number | null;
  completedAudios: string[];
}

export const useAudioSession = () => {
  const [session, setSession] = useState<AudioSession>({
    isActive: false,
    language: '',
    languageName: '',
    startTime: null,
    completedAudios: []
  });

  const startAudioSession = useCallback((language: string, languageName: string) => {
    const existingCompletedAudios = JSON.parse(localStorage.getItem('completedAudios') || '[]');
    const newSession = {
      isActive: true,
      language,
      languageName,
      startTime: Date.now(),
      completedAudios: existingCompletedAudios
    };
    setSession(newSession);
    localStorage.setItem('audioSession', JSON.stringify(newSession));
  }, []);

  const endAudioSession = useCallback(() => {
    const newSession = {
      isActive: false,
      language: '',
      languageName: '',
      startTime: null,
      completedAudios: session.completedAudios
    };
    setSession(newSession);
    localStorage.removeItem('audioSession');
  }, [session.completedAudios]);

  const markAudioAsCompleted = useCallback((language: string) => {
    const updatedCompleted = [...session.completedAudios, language];
    const updatedSession = { ...session, completedAudios: updatedCompleted };
    setSession(updatedSession);
    localStorage.setItem('completedAudios', JSON.stringify(updatedCompleted));
    localStorage.setItem('audioSession', JSON.stringify(updatedSession));
  }, [session]);

  const getSessionDuration = useCallback(() => {
    if (!session.startTime) return 0;
    return Math.floor((Date.now() - session.startTime) / 1000 / 60); // minutes
  }, [session.startTime]);

  // Recuperar sesión de localStorage al cargar
  useEffect(() => {
    const savedSession = localStorage.getItem('audioSession');
    const savedCompleted = localStorage.getItem('completedAudios');
    
    if (savedSession) {
      try {
        const parsedSession = JSON.parse(savedSession);
        if (savedCompleted) {
          parsedSession.completedAudios = JSON.parse(savedCompleted);
        }
        setSession(parsedSession);
      } catch (error) {
        localStorage.removeItem('audioSession');
        localStorage.removeItem('completedAudios');
      }
    } else if (savedCompleted) {
      try {
        const completedAudios = JSON.parse(savedCompleted);
        setSession(prev => ({ ...prev, completedAudios }));
      } catch (error) {
        localStorage.removeItem('completedAudios');
      }
    }
  }, []);

  return {
    session,
    startAudioSession,
    endAudioSession,
    markAudioAsCompleted,
    getSessionDuration
  };
};
