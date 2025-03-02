import React, { useState, useEffect, useRef } from 'react';
import { Check, Copy } from 'lucide-react';
import Prism from 'prismjs';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-javascript';
import '../../styles/prism-one-dark.css';

interface CodeExampleProps {
  code: string;
  language?: string;
  title?: string;
  className?: string;
  showLineNumbers?: boolean;
  maxHeight?: string;
}

export const CodeExample: React.FC<CodeExampleProps> = ({ 
  code, 
  language = 'typescript', 
  title,
  className = '',
  showLineNumbers = false,
  maxHeight = '500px'
}) => {
  const [copied, setCopied] = useState(false);
  const codeRef = useRef<HTMLElement>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    if (codeRef.current) {
      Prism.highlightElement(codeRef.current);
    }
  }, [code, language]);

  // One Dark theme colors for UI elements
  const colors = {
    titleBg: '#21252b',   // Title background - slightly lighter than code background
    buttonBg: '#21252b',  // Button background
    border: '#181a1f'     // Border color
  };

  const lineNumbersClass = showLineNumbers ? 'line-numbers' : '';

  return (
    <div className={`relative rounded-md overflow-hidden border ${className}`} style={{ borderColor: colors.border }}>
      {title && (
        <div 
          className="px-4 py-2 text-sm font-medium text-gray-200 border-b"
          style={{ 
            backgroundColor: colors.titleBg,
            borderColor: colors.border
          }}
        >
          {title}
        </div>
      )}
      <div className="relative overflow-hidden" style={{ backgroundColor: '#282c34' }}>
        <pre className={`p-4 text-sm m-0 ${lineNumbersClass}`} style={{ maxHeight: maxHeight === 'none' ? 'none' : maxHeight, overflow: maxHeight === 'none' ? 'visible' : 'auto', backgroundColor: 'transparent' }}>
          <code ref={codeRef} className={`language-${language}`}>
            {code}
          </code>
        </pre>
        <button
          onClick={handleCopy}
          style={{ backgroundColor: colors.buttonBg }}
          className="absolute top-2 right-2 p-2 rounded text-gray-300 hover:bg-opacity-80 transition-colors"
          aria-label="Copy code"
          title="Copy code"
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
        </button>
      </div>
    </div>
  );
};
