"use client";

import Image from "next/image";
import React, { useState } from "react";

export default function ApiKeyManagement() {
  // State for toggles
  const [openAIToggle, setOpenAIToggle] = useState(true);
  const [geminiToggle, setGeminiToggle] = useState(false);
  const [autoRotate, setAutoRotate] = useState(false);
  const [usageAlerts, setUsageAlerts] = useState(false);
  const [auditLogging, setAuditLogging] = useState(false);

  return (
    <div className="flex flex-col">
      <div className="flex flex-wrap gap-y-6 -mx-3">
        {/* Left Section */}
        <div className="lg:w-3/5 w-full px-3">
          <div className="mb-4 p-5 relative">
            {/* Background Blobs */}
            <div className="rounded-xl absolute inset-0 bg-[#e4e4e4] overflow-hidden">
              <div className="w-[27vw] h-[11vw] rounded-[50%] bg-[#0198FF] blur-[100px] absolute top-[10vw] right-[10vw] rotate-[37deg] opacity-80"></div>
              <div className="w-[40vw] h-[18vw] rounded-[50%] bg-[#FEDCB6] blur-[130px] absolute top-[6vw] -right-[15vw] rotate-[50deg]"></div>
              <div className="w-[17vw] h-[11vw] rounded-[50%] bg-[#0198FF] blur-[70px] absolute top-[20vw] -right-[10vw] -rotate-[37deg] opacity-80"></div>
            </div>

            <div className="relative">
              <div className="flex flex-wrap gap-y-5">
                <div className="lg:-mt-9 md:w-1/2 md:order-last text-center">
                  <Image
                    src="/images/apikey-3d.png"
                    alt="API Key"
                    width={300}
                    height={300}
                    className="max-w-full inline-block"
                  />
                </div>

                <div className="flex flex-col items-start justify-center space-y-5 md:w-1/2 md:order-first">
                  <div>
                    <h2 className="xl:text-4xl lg:text-3xl md:text-2xl text-xl font-extrabold leading-[1.2]">
                      API Key Management
                    </h2>
                    <p>Configure your AI service providers</p>
                  </div>
                  <a
                    href="#"
                    className="btn btn-secondary inline-flex gap-1 justify-start"
                  >
                    <Image
                      src="/images/icons/plus.svg"
                      alt="Add"
                      width={18}
                      height={18}
                    />{" "}
                    Add Provider
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Provider Cards */}
          <div className="space-y-4">
            {/* OpenAI */}
            <div className="p-4 rounded-lg border border-gray-200 space-y-4">
              <div className="flex flex-wrap justify-between items-center gap-3">
                <div className="flex gap-2">
                  <div className="size-12 flex-none flex justify-center items-center rounded-lg bg-gray-100">
                    <Image src="/images/icons/chatgpt.png" alt="OpenAI" width={30} height={30} />
                  </div>
                  <div>
                    <h4 className="font-bold">
                      OpenAI
                      <span className="ml-1 px-3 py-1 inline-block text-xs font-semibold text-white rounded-full bg-emerald-500">
                        Active
                      </span>
                    </h4>
                    <span className="text-sm font-medium text-gray-500">GPT-4, GPT-4o, and other OpenAI models</span>
                  </div>
                </div>
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={openAIToggle}
                    onChange={() => setOpenAIToggle(!openAIToggle)}
                  />
                  <div className="input-switch"></div>
                </label>
              </div>

              <div className="divide-y divide-gray-200">
                <div className="pb-4 space-y-3">
                  <ul className="flex flex-wrap items-center -mx-1 gap-y-2 sticky top-16 z-10">
                    <li className="flex-1 px-1">
                      <div className="flex items-center light-dark-icon relative">
                        <input type="text" placeholder="API Key" className="form-control pr-10 bg-transparent" />
                        <button type="button" className="w-8 h-8 p-0 flex-none flex justify-center items-center rounded-lg hover:bg-gray-100 absolute right-1 cursor-pointer">
                          <Image src="/images/icons/eye.svg" alt="View" width={18} height={18} />
                        </button>
                      </div>
                    </li>
                    <li className="px-1">
                      <div className="flex gap-1">
                        <button className="btn btn-primary">Save</button>
                        <button className="btn btn-light">Test</button>
                      </div>
                    </li>
                  </ul>

                  <ul className="flex flex-wrap gap-y-4 -mx-2 [&>*]:px-2 [&>*]:flex [&>*]:items-center [&>*]:gap-1">
                    <li>
                      <Image src="/images/icons/check-circle.svg" alt="check" width={16} height={16} />
                      Key validated
                    </li>
                    <li>
                      <Image src="/images/icons/clock.svg" alt="clock" width={16} height={16} />
                      Last used: 2 hours ago
                    </li>
                  </ul>
                </div>

                <div className="pt-4 space-y-3">
                  <h3 className="xl:text-lg text-base font-bold text-secondary-700">Usage Limits</h3>
                  <div className="flex flex-wrap -mx-2 gap-y-5">
                    <div className="sm:w-1/2 w-full px-2">
                      <label htmlFor="dailyOpenAI" className="form-label">Daily Limit ($)</label>
                      <input type="number" id="dailyOpenAI" placeholder="50" className="form-control" />
                    </div>
                    <div className="sm:w-1/2 w-full px-2">
                      <label htmlFor="monthlyOpenAI" className="form-label">Monthly Limit ($)</label>
                      <input type="number" id="monthlyOpenAI" placeholder="500" className="form-control" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Google Gemini */}
            <div className="p-4 rounded-lg border border-gray-200 space-y-4">
              <div className="flex flex-wrap justify-between items-center gap-3">
                <div className="flex gap-2">
                  <div className="size-12 flex-none flex justify-center items-center rounded-lg bg-gray-100">
                    <Image src="/images/icons/gemini.png" alt="Google Gemini" width={30} height={30} />
                  </div>
                  <div>
                    <h4 className="font-bold">
                      Google Gemini
                      <span className="ml-1 px-3 py-1 inline-block text-xs font-semibold text-white rounded-full bg-emerald-500">
                        Active
                      </span>
                    </h4>
                    <span className="text-sm font-medium text-gray-500">Gemini Pro, Gemini Flash, and other Google AI models</span>
                  </div>
                </div>
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={geminiToggle}
                    onChange={() => setGeminiToggle(!geminiToggle)}
                  />
                  <div className="input-switch"></div>
                </label>
              </div>

              <div className="divide-y divide-gray-200">
                <div className="pb-4 space-y-3">
                  <ul className="flex flex-wrap items-center -mx-1 gap-y-2 sticky top-16 z-10">
                    <li className="flex-1 px-1">
                      <div className="flex items-center light-dark-icon relative">
                        <input type="text" placeholder="API Key" className="form-control pr-10 bg-transparent" />
                        <button type="button" className="w-8 h-8 p-0 flex-none flex justify-center items-center rounded-lg hover:bg-gray-100 absolute right-1 cursor-pointer">
                          <Image src="/images/icons/eye.svg" alt="View" width={18} height={18} />
                        </button>
                      </div>
                    </li>
                    <li className="px-1">
                      <div className="flex gap-1">
                        <button className="btn btn-primary">Save</button>
                        <button className="btn btn-light">Test</button>
                      </div>
                    </li>
                  </ul>

                  <ul className="flex flex-wrap gap-y-4 -mx-2 [&>*]:px-2 [&>*]:flex [&>*]:items-center [&>*]:gap-1">
                    <li>
                      <Image src="/images/icons/check-circle.svg" alt="check" width={16} height={16} />
                      Key validated
                    </li>
                    <li>
                      <Image src="/images/icons/clock.svg" alt="clock" width={16} height={16} />
                      Last used: 2 hours ago
                    </li>
                  </ul>
                </div>

                <div className="pt-4 space-y-3">
                  <h3 className="xl:text-lg text-base font-bold text-secondary-700">Usage Limits</h3>
                  <div className="flex flex-wrap -mx-2 gap-y-5">
                    <div className="sm:w-1/2 w-full px-2">
                      <label htmlFor="dailyGemini" className="form-label">Daily Limit ($)</label>
                      <input type="number" id="dailyGemini" placeholder="50" className="form-control" />
                    </div>
                    <div className="sm:w-1/2 w-full px-2">
                      <label htmlFor="monthlyGemini" className="form-label">Monthly Limit ($)</label>
                      <input type="number" id="monthlyGemini" placeholder="500" className="form-control" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Security */}
        <div className="lg:w-2/5 w-full px-3">
          <div className="rounded-xl border light-border bg-white p-4 space-y-5">
            <div>
              <h3 className="xl:text-xl text-lg font-bold text-secondary-700">Security Settings</h3>
              <p className="text-sm font-medium text-gray-500">Configure API key security and rotation</p>
            </div>

            {/* Security Options */}
            <div className="p-4 rounded-lg border border-gray-200 flex flex-wrap gap-3">
              <div>
                <h4 className="font-bold">Auto-rotate API keys</h4>
                <span className="text-sm text-gray-500">Automatically rotate keys every 90 days</span>
              </div>
              <label className="inline-flex items-center gap-2 cursor-pointer ml-auto">
                <input type="checkbox" className="sr-only peer" checked={autoRotate} onChange={() => setAutoRotate(!autoRotate)} />
                <div className="input-switch"></div>
              </label>
            </div>

            <div className="p-4 rounded-lg border border-gray-200 flex flex-wrap gap-3">
              <div>
                <h4 className="font-bold">Usage alerts</h4>
                <span className="text-sm text-gray-500">Notify when approaching usage limits</span>
              </div>
              <label className="inline-flex items-center gap-2 cursor-pointer ml-auto">
                <input type="checkbox" className="sr-only peer" checked={usageAlerts} onChange={() => setUsageAlerts(!usageAlerts)} />
                <div className="input-switch"></div>
              </label>
            </div>

            <div className="p-4 rounded-lg border border-gray-200 flex flex-wrap gap-3">
              <div>
                <h4 className="font-bold">Audit logging</h4>
                <span className="text-sm text-gray-500">Log all API key usage for security audit</span>
              </div>
              <label className="inline-flex items-center gap-2 cursor-pointer ml-auto">
                <input type="checkbox" className="sr-only peer" checked={auditLogging} onChange={() => setAuditLogging(!auditLogging)} />
                <div className="input-switch"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
