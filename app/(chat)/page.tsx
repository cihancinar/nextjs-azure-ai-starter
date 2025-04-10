'use client';

import { useChat } from '@ai-sdk/react';
import { useRef, useEffect } from 'react';
import { User, Bot, Send } from 'lucide-react';

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: 'smooth'
    });
  }, [messages]);

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-zinc-900">
      {/* Chat messages container */}
      <div className="flex-1 w-full max-w-2xl mx-auto pb-36">
        <div className="flex flex-col space-y-4 p-4">
          {messages.map(message => (
            <div 
              key={message.id} 
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className="flex items-start gap-3 max-w-xs md:max-w-md lg:max-w-lg">
                <div className="flex-shrink-0">
                  {message.role === 'user' ? (
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                      <User size={16} className="text-white" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center">
                      <Bot size={16} className="text-white" />
                    </div>
                  )}
                </div>
                <div className="whitespace-pre-wrap break-words text-sm md:text-base">
                  {message.parts.map((part, i) => {
                    switch (part.type) {
                      case 'text':
                        return <div key={`${message.id}-${i}`}>{part.text}</div>;
                      default:
                        return null;
                    }
                  })}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      {/* Chat Input */}
      <div className="fixed bottom-0 left-0 right-0 px-4 pb-4 pt-6 bg-white dark:bg-zinc-900">
        <div className="max-w-2xl mx-auto">
          <form 
            onSubmit={handleSubmit}
            className="relative border border-gray-200 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 shadow-lg"
          >
            <div className="flex items-center">
              <textarea
                className="w-full py-3 px-4 pr-10 resize-none max-h-40 bg-transparent focus:outline-none dark:text-white text-sm md:text-base"
                value={input}
                placeholder="Message..."
                onChange={handleInputChange}
                rows={1}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    if (input.trim()) {
                      handleSubmit(e);
                    }
                  }
                }}
                style={{ minHeight: '44px' }}
              />
              <button 
                type="submit" 
                className={`absolute right-2 p-2 rounded-md ${
                  input.trim() ? 'text-blue-500 hover:bg-blue-50 dark:hover:bg-zinc-700' : 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                }`}
                disabled={!input.trim()}
              >
                <Send size={18} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}