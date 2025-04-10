'use client';

import { useChat } from '@ai-sdk/react';
import { useRef, useEffect } from 'react';
import Image from 'next/image';
import { ArrowUp } from 'lucide-react';
import TextareaAutosize from 'react-textarea-autosize';

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
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {/* For user messages, remove icon and use a beige background bubble */}
              {message.role === 'user' ? (
                <div className="p-3 rounded-lg bg-[#1670ec] text-white whitespace-pre-wrap break-words text-sm md:text-base max-w-xs md:max-w-md lg:max-w-lg">
                  {message.parts.map((part, i) => {
                    switch (part.type) {
                      case 'text':
                        return <div key={`${message.id}-${i}`}>{part.text}</div>;
                      default:
                        return null;
                    }
                  })}
                </div>
              ) : (
                <div className="flex items-start gap-3 max-w-xs md:max-w-md lg:max-w-lg">
                                    <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-white border border-[#1670ec] flex items-center justify-center overflow-hidden">
                      <Image
                        src="/azure-ai-bot-avatar.avif"
                        alt="AI Assistant"
                        width={32}
                        height={32}
                        className="object-cover"
                        priority
                      />
                    </div>
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
              )}
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
          className="border border-gray-200 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 shadow-lg p-3"
        >
          {/* Use flex with items-end so the textarea grows, and the button remains aligned at the bottom */}
          <div className="flex items-end gap-2">
            <TextareaAutosize
              minRows={1}
              maxRows={6}
              className="w-full py-2 px-3 bg-transparent focus:outline-none dark:text-white text-sm md:text-base resize-none"
              value={input}
              placeholder="Send a message..."
              onChange={handleInputChange}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  if (input.trim()) {
                    handleSubmit(e);
                  }
                }
              }}
            />

            {/* Remove absolute positioning and let flex layout position the button at the bottom */}
            <button
              type="submit"
              className={`rounded-full p-2 ${
                input.trim()
                  ? 'bg-[#1670ec] text-white hover:bg-[#125aa5]'
                  : 'bg-gray-300 text-gray-600 cursor-not-allowed'
              }`}
              disabled={!input.trim()}
            >
              <ArrowUp size={18} />
            </button>
          </div>
        </form>
        </div>
      </div>
    </div>
  );
}