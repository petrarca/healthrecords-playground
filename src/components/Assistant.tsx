import React, { useState, useEffect, useRef } from 'react';
import { useAssistant } from '../services/assistant/useAssistant';
import { format } from 'date-fns';
import { navigationService } from '../services/navigationService';
import { useNavigate } from 'react-router-dom';
import DOMPurify from 'dompurify';

interface ChatProps {
  isOpen: boolean;
  onClose: () => void;
}

// Create a separate component for message content
const MessageContent: React.FC<{ content: string }> = ({ content }) => {
  const navigate = useNavigate();
  const contentRef = useRef<HTMLElement>(null);
  
  // Sanitize the HTML to prevent XSS attacks
  const sanitizedHtml = DOMPurify.sanitize(content);
  
  useEffect(() => {
    if (contentRef.current) {
      const links = contentRef.current.querySelectorAll('a');
      
      const handleLinkClick = (e: Event) => {
        e.preventDefault();
        const href = (e.currentTarget as HTMLAnchorElement).getAttribute('href');
        if (href) {
          navigate(href);
        }
      };
      
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          const href = (e.currentTarget as HTMLAnchorElement).getAttribute('href');
          if (href) {
            navigate(href);
          }
        }
      };
      
      links.forEach(link => {
        // Add click listener
        link.addEventListener('click', handleLinkClick);
        
        // Ensure links are keyboard accessible
        link.setAttribute('tabindex', '0');
        
        // Add keyboard listener
        link.addEventListener('keydown', handleKeyDown);
      });
      
      // Cleanup function to remove event listeners
      return () => {
        links.forEach(link => {
          link.removeEventListener('click', handleLinkClick);
          link.removeEventListener('keydown', handleKeyDown);
        });
      };
    }
  }, [content, navigate]);
  
  return (
    <section 
      ref={contentRef}
      className="text-sm leading-relaxed"
      aria-label="Assistant message content"
      dangerouslySetInnerHTML={{ __html: sanitizedHtml.replace(/\n/g, '<br>') }}
    />
  );
};

export const Assistant: React.FC<ChatProps> = ({ isOpen, onClose }) => {
  const [message, setMessage] = useState('');
  const { messages, isProcessing, sendMessage } = useAssistant();
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Set up navigation service with router's navigate function
  useEffect(() => {
    navigationService.setNavigate(navigate);
  }, [navigate]);

  // Scroll to bottom whenever messages change or when component is opened
  useEffect(() => {
    if (messagesEndRef.current && isOpen) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isProcessing, isOpen]);

  // Set focus on input field when assistant opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      // Small delay to ensure the component is fully rendered
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      await sendMessage(message);
      setMessage('');
    }
  };

  const formatTime = (date: Date) => {
    return format(date, 'HH:mm');
  };

  return (
    <div 
      className={`h-full bg-white border-l border-gray-200 shadow-lg flex flex-col ${
        isOpen ? 'block' : 'hidden'
      }`}
    >
      {/* Chat Header */}
      <div className="border-b border-gray-200 flex items-center justify-between px-6 py-3 bg-gradient-to-r from-blue-50 to-blue-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" 
              />
            </svg>
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">Medical Assistant</h2>
            <div className="flex items-center">
              <span className="text-xs text-gray-500">Press Shift+Space to toggle</span>
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-blue-200 rounded-lg transition-colors duration-150"
          aria-label="Close chat"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-gray-50 to-white">
        <div className="flex flex-col gap-6">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
              {msg.sender === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" 
                    />
                  </svg>
                </div>
              )}
              {msg.sender === 'user' && (
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
                    />
                  </svg>
                </div>
              )}
              <div className={`flex flex-col gap-1 min-w-0 ${msg.sender === 'user' ? 'items-end w-[calc(100%-44px)]' : ''}`}>
                <div className={`${
                  msg.sender === 'assistant' 
                    ? 'bg-blue-50 text-gray-800 max-w-[90%]' 
                    : 'bg-purple-100 text-gray-800 w-full'
                  } rounded-2xl px-4 py-2`}>
                  <MessageContent content={msg.content} />
                </div>
                <span className={`text-xs text-gray-500 ${msg.sender === 'user' ? 'mr-2' : 'ml-2'}`}>
                  {formatTime(msg.timestamp)}
                </span>
              </div>
            </div>
          ))}
          
          {isProcessing && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" 
                  />
                </svg>
              </div>
              <div className="bg-blue-50 rounded-2xl px-4 py-2.5">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  <div className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: '600ms' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Chat Input */}
      <div className="border-t border-gray-200 p-3 bg-white">
        <form className="flex gap-2 h-full" onSubmit={handleSubmit}>
          <div className="relative flex-1">
            <input
              ref={inputRef}
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your medical question..."
              className="w-full h-full px-4 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              disabled={isProcessing}
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <button
                type="button"
                className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors duration-150"
                title="Upload file"
                disabled={isProcessing}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={!message.trim() || isProcessing}
            className={`px-5 rounded-xl flex items-center justify-center transition-all duration-150 ${
              message.trim() && !isProcessing
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};
