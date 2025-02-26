import React, { useState } from 'react';

interface ChatProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Assistant: React.FC<ChatProps> = ({ isOpen, onClose }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      // Handle message submission
      setMessage('');
    }
  };

  return (
    <div 
      className={`fixed right-0 top-16 bottom-0 w-96 bg-white border-l border-gray-200 shadow-lg transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      {/* Chat Header */}
      <div className="h-16 border-b border-gray-200 flex items-center justify-between px-6 bg-gradient-to-r from-blue-50 to-blue-100">
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
            <span className="text-xs text-green-600">Online</span>
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
      <div className="h-[calc(100%-8rem)] overflow-y-auto p-6 bg-gradient-to-b from-gray-50 to-white">
        <div className="flex flex-col gap-6">
          {/* Assistant Message */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" 
                />
              </svg>
            </div>
            <div className="flex flex-col gap-1 min-w-0">
              <div className="bg-blue-50 rounded-2xl px-4 py-2.5 max-w-[90%]">
                <p className="text-sm text-gray-800 leading-relaxed">
                  Hello! I'm your medical assistant. I can help you find information about patients, medical records, or answer general healthcare questions. How can I assist you today?
                </p>
              </div>
              <span className="text-xs text-gray-500 ml-2">11:32 AM</span>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Input */}
      <div className="h-16 border-t border-gray-200 p-3 bg-white">
        <form className="flex gap-2 h-full" onSubmit={handleSubmit}>
          <div className="relative flex-1">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your medical question..."
              className="w-full h-full px-4 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <button
                type="button"
                className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors duration-150"
                title="Upload file"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={!message.trim()}
            className={`px-5 rounded-xl flex items-center justify-center transition-all duration-150 ${
              message.trim()
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
