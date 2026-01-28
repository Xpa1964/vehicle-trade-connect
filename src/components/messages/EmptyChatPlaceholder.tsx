
import React from 'react';
import { MessageSquare } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const EmptyChatPlaceholder: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
      <div className="text-center max-w-md mx-auto">
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
          <MessageSquare className="h-8 w-8 sm:h-10 sm:w-10 text-gray-400" />
        </div>
        
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">
          {t('messages.selectConversationPlaceholder', { fallback: 'Selecciona una conversación' })}
        </h3>
        
        <p className="text-sm sm:text-base text-gray-500 leading-relaxed">
          {t('messages.selectConversationDescription', { fallback: 'Elige una conversación de la lista para ver los mensajes y continuar la comunicación.' })}
        </p>
        
        <div className="mt-6 sm:mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <p className="text-xs sm:text-sm text-blue-700">
            💡 <strong>{t('messages.tip', { fallback: 'Consejo' })}:</strong> {t('messages.tipText', { fallback: 'Usa el Directorio de Usuarios para encontrar contactos o el botón de Contactar KONTACT VO para soporte directo.' })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmptyChatPlaceholder;
