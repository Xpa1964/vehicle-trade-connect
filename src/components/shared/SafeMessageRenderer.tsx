import React from 'react';

interface SafeMessageRendererProps {
  message: string;
  className?: string;
}

/**
 * Secure message renderer that avoids dangerouslySetInnerHTML
 * Renders messages with basic formatting (bold, lists, line breaks) safely using React components
 */
export const SafeMessageRenderer: React.FC<SafeMessageRendererProps> = ({ 
  message, 
  className = '' 
}) => {
  const renderMessage = () => {
    const lines = message.split('\n');
    
    return lines.map((line, lineIndex) => {
      // Detect list items (• or numbered)
      if (line.trim().startsWith('• ') || /^\d+\.\s/.test(line.trim())) {
        return (
          <li key={lineIndex} className="ml-4">
            {renderTextWithFormatting(line.replace(/^[•\d.]\s*/, ''))}
          </li>
        );
      }
      
      // Regular lines
      return (
        <React.Fragment key={lineIndex}>
          {renderTextWithFormatting(line)}
          {lineIndex < lines.length - 1 && <br />}
        </React.Fragment>
      );
    });
  };
  
  // Render text with basic formatting (**bold**, *italic*)
  const renderTextWithFormatting = (text: string) => {
    const parts: React.ReactNode[] = [];
    let remaining = text;
    let key = 0;
    
    // Process bold **text**
    const boldRegex = /\*\*(.*?)\*\*/g;
    let lastIndex = 0;
    let match;
    
    while ((match = boldRegex.exec(text)) !== null) {
      // Text before the match
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }
      // Bold text
      parts.push(<strong key={`bold-${key++}`}>{match[1]}</strong>);
      lastIndex = match.index + match[0].length;
    }
    
    // Remaining text
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }
    
    return parts.length > 0 ? parts : text;
  };
  
  return (
    <div className={className}>
      {renderMessage()}
    </div>
  );
};
