'use client';

import { useState } from 'react';
import { mockConversations } from '@/lib/mockData';
import { formatDate } from '@/lib/formatters';
import Image from 'next/image';
import SendIcon from './icons/SendIcon';
import PlusIcon from './icons/PlusIcon';

export default function ChatContent() {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim()) {
      // Handle send
      setMessage('');
    }
  };

  return (
    <div className="grid grid-cols-[580px_1fr] gap-6 h-[calc(100vh-200px)]">
      {/* Conversations List */}
      <div className="bg-white border border-[#e1e1e1] rounded-xl overflow-hidden flex flex-col">
        <div className="bg-[#f6f6f6] p-6 border-b border-[#e1e1e1]">
          <h2 className="heading-xl mb-2">Conversations</h2>
          <button className="bg-[#1d1d1d] text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2">
            <PlusIcon width={11} height={11} color="white" />
            New Chat
          </button>
          <p className="text-lg text-[#676767] mt-4">Previous chat history</p>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {mockConversations.map((conv) => (
            <div key={conv.id} className="p-4 hover:bg-gray-50 rounded-lg cursor-pointer">
              <div className="flex items-start justify-between mb-2">
                <p className="font-bold text-lg">{conv.title}</p>
                <span className="badge badge-primary">{conv.messageCount}</span>
              </div>
              <p className="text-base text-[#676767] mb-2">{conv.lastMessage}</p>
              <p className="text-base text-[#676767]">{formatDate(conv.timestamp)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="bg-white border border-[#e1e1e1] rounded-xl flex flex-col">
        <div className="p-6 border-b border-[#e1e1e1]">
          <h2 className="heading-xl mb-2">Knowledge Chat</h2>
          <p className="text-lg text-[#676767]">
            Ask questions about your documents and get AI-powered answers
          </p>
        </div>

        <div className="flex-1 flex items-center justify-center p-12">
          <div className="text-center max-w-md">
            <Image
              src="/images/chat-illustration.png"
              alt="Chat"
              width={300}
              height={300}
              className="mx-auto mb-8"
            />
            <h3 className="text-lg font-bold mb-2">Start a conversation</h3>
            <p className="text-base text-[#676767]">
              Ask questions about your documents and I'll help you find the answers.
            </p>
          </div>
        </div>

        <div className="p-6 border-t border-[#e1e1e1]">
          <div className="flex items-center gap-3 bg-white border border-[#e1e1e1] rounded-xl px-4 py-3">
            <input
              type="text"
              placeholder="Ask question about your documents"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1 outline-none opacity-60"
            />
            <button
              onClick={handleSend}
              className="w-8 h-8 bg-[#0198ff] rounded-lg flex items-center justify-center"
            >
              <SendIcon width={30} height={29} color="white" />
            </button>
          </div>
          <p className="text-sm text-[#cecece] mt-2">
            Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
}