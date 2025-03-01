import React from 'react';

interface MessageProps {
  text: string;
  sender: 'user' | 'assistant';
  timestamp: string;
}

// Message component for displaying chat messages
const Message: React.FC<MessageProps> = ({ text, sender, timestamp }) => {
  return (
    <div className={`mb-4 ${sender === 'user' ? 'text-right' : ''}`}>
      <div
        className={`inline-block max-w-[85%] px-4 py-2 rounded-lg ${
          sender === 'user'
            ? 'bg-blue-600 text-white rounded-br-none'
            : 'bg-gray-100 text-gray-800 rounded-bl-none'
        }`}
      >
        <div className="text-sm">{text}</div>
      </div>
      <div className="mt-1 text-xs text-gray-500">
        {sender === 'user' ? 'You' : 'Assistant'} • {timestamp}
      </div>
    </div>
  );
};

export default Message;
