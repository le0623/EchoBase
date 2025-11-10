"use client";

import Image from 'next/image';
import React, { useState, useEffect, useRef } from 'react';

interface Conversation {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messageCount: number;
  preview: string;
}

interface Message {
  id: string;
  role: 'USER' | 'ASSISTANT';
  content: string;
  createdAt: string;
}

export default function AiPowerChat() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingConversations, setIsLoadingConversations] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatAreaRef = useRef<HTMLDivElement>(null);

  // Fetch conversations on mount
  useEffect(() => {
    fetchConversations();
  }, []);

  // Fetch messages when conversation changes
  useEffect(() => {
    if (currentConversationId) {
      fetchMessages(currentConversationId);
    } else {
      setMessages([]);
    }
  }, [currentConversationId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchConversations = async () => {
    try {
      setIsLoadingConversations(true);
      const response = await fetch('/api/conversations');
      if (response.ok) {
        const data = await response.json();
        setConversations(data.conversations || []);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to load conversations');
      }
    } catch (err) {
      setError('An error occurred while loading conversations');
    } finally {
      setIsLoadingConversations(false);
    }
  };

  const fetchMessages = async (conversationId: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/conversations/${conversationId}/messages`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to load messages');
      }
    } catch (err) {
      setError('An error occurred while loading messages');
    } finally {
      setIsLoading(false);
    }
  };

  const createNewConversation = async () => {
    try {
      setIsSending(true);
      setError('');
      const response = await fetch('/api/conversations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: 'New Conversation' }),
      });

      if (response.ok) {
        const data = await response.json();
        setCurrentConversationId(data.conversation.id);
        setMessages([]);
        await fetchConversations();
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to create conversation');
        if (errorData.error?.includes('No knowledge base initialized')) {
          // Show this error prominently
        }
      }
    } catch (err) {
      setError('An error occurred while creating conversation');
    } finally {
      setIsSending(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isSending) return;

    const messageContent = inputValue.trim();
    setInputValue('');
    setError('');

    // If no conversation exists, create one first
    let conversationId = currentConversationId;
    if (!conversationId) {
      try {
        setIsSending(true);
        const createResponse = await fetch('/api/conversations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ title: messageContent.substring(0, 50) }),
        });

        if (!createResponse.ok) {
          const errorData = await createResponse.json();
          setError(errorData.error || 'Failed to create conversation');
          setIsSending(false);
          return;
        }

        const createData = await createResponse.json();
        conversationId = createData.conversation.id;
        setCurrentConversationId(conversationId);
        await fetchConversations();
      } catch (err) {
        setError('An error occurred while creating conversation');
        setIsSending(false);
        return;
      }
    }

    // Add user message to UI immediately
    const userMessage: Message = {
      id: `temp-${Date.now()}`,
      role: 'USER',
      content: messageContent,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);

    // Send message to API
    try {
      setIsSending(true);
      const response = await fetch(`/api/conversations/${conversationId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: messageContent }),
      });

      if (response.ok) {
        const data = await response.json();
        // Remove temp message and add real messages
        setMessages((prev) => {
          const filtered = prev.filter((msg) => !msg.id.startsWith('temp-'));
          return [
            ...filtered,
            data.userMessage,
            data.assistantMessage,
          ];
        });
        await fetchConversations(); // Refresh conversations to update title if needed
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to send message');
        // Remove temp message on error
        setMessages((prev) => prev.filter((msg) => !msg.id.startsWith('temp-')));
      }
    } catch (err) {
      setError('An error occurred while sending message');
      // Remove temp message on error
      setMessages((prev) => prev.filter((msg) => !msg.id.startsWith('temp-')));
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const selectConversation = (conversationId: string) => {
    setCurrentConversationId(conversationId);
  };
  return (
    <div className="flex flex-col">
      <div className="flex flex-wrap gap-y-6 -mx-2">
        {/* Conversations Sidebar */}
        <div className="lg:w-2/6 w-full px-2 flex flex-col">
          <div className="rounded-xl border light-border bg-white h-full flex flex-col">
            <div className="p-4 rounded-t-xl bg-gray-50 flex flex-wrap justify-between items-start gap-3">
              <div className="flex-1">
                <h3 className="xl:text-3xl lg:text-2xl md:text-xl text-xl font-extrabold leading-[1.2]">
                  Conversations
                </h3>
                <p className="font-medium text-gray-500">Previous chat history</p>
              </div>
              <button
                onClick={createNewConversation}
                disabled={isSending}
                className="btn btn-secondary !inline-flex gap-1 !justify-start text-nowrap"
              >
                <Image src="/images/icons/plus.svg" alt="" width={16} height={16} />
                New Chat
              </button>
            </div>
            <div className="p-4 flex-1 overflow-y-auto">
              {isLoadingConversations ? (
                <div className="flex justify-center py-10">
                  <div className="w-8 h-8 border-4 border-gray-200 border-t-primary rounded-full animate-spin"></div>
                </div>
              ) : conversations.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                  No conversations yet. Start a new chat to begin.
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {conversations.map((conv) => (
                    <div
                      key={conv.id}
                      onClick={() => selectConversation(conv.id)}
                      className={`flex flex-col items-start gap-2 py-3 cursor-pointer hover:bg-gray-50 rounded-lg px-2 transition-colors ${
                        currentConversationId === conv.id ? 'bg-gray-100' : ''
                      }`}
                    >
                      <h4 className="text-base font-semibold text-wrap break-all">
                        {conv.title}{" "}
                        {conv.messageCount > 0 && (
                          <span className="size-5 text-xs text-white inline-flex justify-center items-center rounded-full bg-primary-500">
                            {conv.messageCount}
                          </span>
                        )}
                      </h4>
                      {conv.preview && (
                        <p className="text-sm font-semibold text-wrap break-all text-gray-500 line-clamp-2">
                          {conv.preview}
                        </p>
                      )}
                      <span className="px-3 py-0.5 text-xs font-semibold rounded-full border border-gray-200 bg-gray-50">
                        {formatDate(conv.updatedAt)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Knowledge Chat */}
        <div className="lg:w-4/6 w-full px-2 flex flex-col">
          <div className="rounded-xl border light-border bg-white p-4 flex flex-col" style={{ minHeight: '600px', maxHeight: 'calc(100vh - 250px)' }}>
            <div className="flex flex-wrap justify-between items-start gap-3 mb-4">
              <div className="flex-1">
                <h3 className="xl:text-3xl lg:text-2xl md:text-xl text-xl font-extrabold leading-[1.2]">
                  Knowledge Chat
                </h3>
                <p className="font-medium text-gray-500">
                  Ask questions about your documents and get AI-powered answers
                </p>
              </div>
            </div>

            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Messages Area */}
            <div
              ref={chatAreaRef}
              className="flex-1 overflow-y-auto mb-4 space-y-4 min-h-0"
            >
              {isLoading && messages.length === 0 ? (
                <div className="flex justify-center items-center h-full">
                  <div className="w-8 h-8 border-4 border-gray-200 border-t-primary rounded-full animate-spin"></div>
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full space-y-4">
                  <div className="relative w-full max-w-md">
                    <div className="rounded-xl absolute inset-0 bg-[#f0f0f0] overflow-hidden">
                      <div className="w-[27vw] h-[11vw] rounded-[50%] bg-[#A899F9] blur-[100px] absolute top-0 right-[1vw] rotate-[37deg]"></div>
                      <div className="w-[20vw] h-[15vw] rounded-[50%] bg-[#FEDCB6] blur-[130px] absolute top-[6vw] right-[5vw] rotate-[50deg]"></div>
                      <div className="w-[7vw] h-[11vw] rounded-[50%] bg-[#A899F9] blur-[70px] absolute top-[10vw] left-[15vw] -rotate-[37deg]"></div>
                    </div>
                    <div className="text-center rounded-xl p-4 relative">
                      <Image
                        src="/images/ai-mob.png"
                        alt=""
                        className="max-w-full inline-block"
                        width={400}
                        height={300}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col items-center space-y-2">
                    <h4 className="text-base font-semibold">Start a conversation</h4>
                    <p className="text-sm text-gray-500 text-center">
                      Ask questions about your documents and I'll help you find the answers.
                    </p>
                  </div>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === 'USER' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg px-4 py-2 ${
                        message.role === 'USER'
                          ? 'bg-primary text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                    </div>
                  </div>
                ))
              )}
              {isSending && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-lg px-4 py-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="space-y-3 border-t pt-4">
              <div className="flex items-center light-dark-icon relative">
                <input
                  type="text"
                  placeholder="Ask question about your documents"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isSending}
                  className="form-control !pr-10 !bg-transparent flex-1"
                />
                <button
                  type="button"
                  onClick={handleSendMessage}
                  disabled={isSending || !inputValue.trim()}
                  className="btn btn-primary size-9 !p-0 flex-none !flex justify-center items-center !rounded-md absolute right-1 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed [&_img]:icon-white"
                >
                  <Image
                    src="/images/icons/send.svg"
                    alt="Send"
                    className="icon-img"
                    width={16}
                    height={16}
                  />
                </button>
              </div>

              <p className="text-xs font-medium text-gray-400">
                Press Enter to send, Shift+Enter for new line
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
