"use client";

import Image from 'next/image';
import React from 'react';

const conversations = [
  {
    title: "Vacation Policy Questions",
    subtitle: "What are the vacation policies for remote employees?",
    count: 4,
    date: "15th Jan, 2024",
  },
  {
    title: "Vacation Policy Questions",
    subtitle: "What are the vacation policies for remote employees?",
    count: 4,
    date: "15th Jan, 2024",
  },
  {
    title: "Vacation Policy Questions",
    subtitle: "What are the vacation policies for remote employees?",
    count: 4,
    date: "15th Jan, 2024",
  },
  {
    title: "Vacation Policy Questions",
    subtitle: "What are the vacation policies for remote employees?",
    count: 4,
    date: "15th Jan, 2024",
  },
  {
    title: "Vacation Policy Questions",
    subtitle: "What are the vacation policies for remote employees?",
    count: 4,
    date: "15th Jan, 2024",
  },
];

export default function AiPowerChat() {
  return (
    <div className="flex flex-col">
      <div className="flex flex-wrap gap-y-6 -mx-2">
        {/* Conversations Sidebar */}
        <div className="lg:w-2/6 w-full px-2">
          <div className="rounded-xl border light-border bg-white h-full">
            <div className="p-4 rounded-t-xl bg-gray-50 flex flex-wrap justify-between items-start gap-3">
              <div className="flex-1">
                <h3 className="xl:text-3xl lg:text-2xl md:text-xl text-xl font-extrabold leading-[1.2]">
                  Conversations
                </h3>
                <p className="font-medium text-gray-500">Previous chat history</p>
              </div>
              <a
                href="#"
                className="btn btn-secondary !inline-flex gap-1 !justify-start text-nowrap"
              >
                <Image src="/images/icons/plus.svg" alt="" width={16} height={16} />
                New Chat
              </a>
            </div>
            <div className="p-4">
              <div className="divide-y divide-gray-200">
                {conversations.map((conv, index) => (
                  <div key={index} className="flex flex-col items-start gap-2 py-3">
                    <h4 className="text-base font-semibold text-wrap break-all">
                      {conv.title}{" "}
                      <span className="size-5 text-xs text-white inline-flex justify-center items-center rounded-full bg-primary-500">
                        {conv.count}
                      </span>
                    </h4>
                    <p className="text-sm font-semibold text-wrap break-all text-gray-500">
                      {conv.subtitle}
                    </p>
                    <span className="px-3 py-0.5 text-xs font-semibold rounded-full border border-gray-200 bg-gray-50">
                      {conv.date}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Knowledge Chat */}
        <div className="lg:w-4/6 w-full px-2">
          <div className="rounded-xl border light-border bg-white h-full p-4 space-y-6">
            <div className="flex flex-wrap justify-between items-start gap-3">
              <div className="flex-1">
                <h3 className="xl:text-3xl lg:text-2xl md:text-xl text-xl font-extrabold leading-[1.2]">
                  Knowledge Chat
                </h3>
                <p className="font-medium text-gray-500">
                  Ask questions about your documents and get AI-powered answers
                </p>
              </div>
              <a
                href="#"
                className="btn btn-transparent !flex gap-1 justify-center items-center size-8 !p-0"
              >
                <Image
                  src="/images/icons/three-dots-vertical.svg"
                  alt=""
                  width={16}
                  height={16}
                />
              </a>
            </div>

            <div className="relative">
              <div className="rounded-xl absolute inset-0 bg-[#f0f0f0] overflow-hidden">
                <div className="w-[27vw] h-[11vw] rounded-[50%] bg-[#A899F9] blur-[100px] absolute top-0 right-[1vw] rotate-[37deg]"></div>
                <div className="w-[20vw] h-[15vw] rounded-[50%] bg-[#FEDCB6] blur-[130px] absolute top-[6vw] right-[5vw] rotate-[50deg]"></div>
                <div className="w-[7vw] h-[11vw] rounded-[50%] bg-[#A899F9] blur-[70px] absolute top-[10vw] left-[15vw] -rotate-[37deg]"></div>
              </div>
              <div className="text-center rounded-xl p-4 relative">
                <Image
                  src="/images/ai-mob.png"
                  alt=""
                  className="max-w-full inline-block lg:-mt-9"
                  width={400}
                  height={300}
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex flex-col items-start">
                <h4 className="text-base font-semibold text-wrap break-all">Start a conversation</h4>
                <p className="text-sm font-semibold text-wrap break-all text-gray-500">
                  Ask questions about your documents and I'll help you find the answers.
                </p>
              </div>

              <div className="flex items-center light-dark-icon relative xl:min-w-lg lg:min-w-sm">
                <input
                  type="text"
                  placeholder="Ask question about your documents"
                  className="form-control !pr-10 !bg-transparent"
                />
                <button
                  type="button"
                  className="btn btn-primary size-9 !p-0 flex-none !flex justify-center items-center !rounded-md absolute right-1 cursor-pointer [&_img]:icon-white"
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
