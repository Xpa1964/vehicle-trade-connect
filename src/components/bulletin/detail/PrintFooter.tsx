
import React from 'react';

const PrintFooter: React.FC = () => {
  return (
    <div className="hidden print:block mt-12 pt-6 border-t border-gray-200">
      <div className="text-center text-sm text-gray-500">
        <p>info@kontact-automotive.com | +34 91 123 45 67</p>
        <p>www.kontact-automotive.com</p>
        <p className="mt-2 text-xs">© {new Date().getFullYear()} Kontact Automotive. Todos los derechos reservados.</p>
      </div>
    </div>
  );
};

export default PrintFooter;
