"use client"; // Next.js 13+ app directory for client-side interactivity
import { useState } from "react";
import Image from "next/image";
import SsoSignIn from "./sign-in-sso";

export default function SignInPage() {
  const [activeTab, setActiveTab] = useState("email");

  return (
    <div className="lg:p-10 px-5 pt-10 pb-5">
      <div className="flex flex-wrap gap-y-10">
        {/* Left Section */}
        <div className="lg:w-1/2 w-full">
          <div className="h-full lg:p-10 p-5 relative">
            <div className="rounded-xl absolute inset-0 bg-[#D6DCD2] overflow-hidden">
              <div className="w-[17vw] h-[11vw] rounded-[50%] bg-[#0198FF] blur-[70px] absolute -top-[1vw] right-[5vw] -rotate-[37deg] opacity-80"></div>
              <div className="w-[30vw] h-[18vw] rounded-[50%] bg-[#FEDCB6] blur-[130px] absolute -top-[2vw] left-[3vw] rotate-[50deg]"></div>
            </div>
            <div className="relative text-center flex flex-col gap-y-10">
              <div className="lg:-mt-16 -mt-10">
                <Image
                  src="/images/bot.png"
                  width={400}
                  height={400}
                  alt="Bot"
                />
              </div>
              <div className="[&_h1_strong]:text-primary-500 space-y-5">
                <h1 className="xl:text-5xl lg:text-4xl md:text-3xl text-2xl font-extrabold leading-[1.2]">
                  Transform Your Documents Into Intelligent{" "}
                  <strong>Knowledge</strong>
                </h1>
                <p>
                  Upload, process, and search through your organization's
                  documents with AI-powered intelligence. Get instant answers
                  from your knowledge base.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="lg:w-1/2 w-full">
          <div className="rounded-xl h-full lg:px-10 relative space-y-8 flex flex-col justify-center">
            <div className="[&_h1_strong]:text-primary-500 space-y-5 text-center">
              <h2 className="xl:text-5xl lg:text-4xl md:text-3xl text-2xl font-extrabold leading-[1.2]">
                Welcome back
              </h2>
              <p>
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s.
              </p>
            </div>

            {/* Tabs */}
            <div className="max-w-sm mx-auto text-center">
              <div className="p-1 rounded-xl border light-border flex justify-center gap-1 [&_.btn]:!border-transparent [&_.btn]:!bg-transparent [&_.btn.active]:text-white [&_.btn.active]:!bg-gray-900 [&_.btn.active]:hover:bg-gray-800">
                <button
                  className={`btn flex-1 ${activeTab === "email" ? "active" : ""
                    }`}
                  onClick={() => setActiveTab("email")}
                >
                  Email
                </button>
                <button
                  className={`btn flex-1 ${activeTab === "sso" ? "active" : ""
                    }`}
                  onClick={() => setActiveTab("sso")}
                >
                  SSO
                </button>
              </div>
            </div>

            {/* Conditional content */}
            <div className="max-w-sm mx-auto">
              {activeTab === "email" && (
                <>
                  {" "}
                  {/* Header */}
                  <div className="text-center">
                    <h3 className="mb-2 xl:text-2xl font-bold">
                      Sign in with email
                    </h3>
                    <p>Enter your email and password to continue</p>
                  </div>
                  {/* Form */}
                  <div className="space-y-5">
                    <div>
                      <input
                        type="email"
                        id="email"
                        placeholder="Email address"
                        className="form-control w-full p-3 border rounded-lg"
                      />
                    </div>

                    <div>
                      <input
                        type="password"
                        id="password"
                        placeholder="Password"
                        className="form-control w-full p-3 border rounded-lg"
                      />
                    </div>

                    {/* Remember & Forgot */}
                    <div className="flex justify-between gap-5">
                      <label className="relative inline-flex items-center gap-1.5 cursor-pointer">
                        <input type="checkbox" className="input-checkbox" />
                        <span className="font-medium">Remember me</span>
                      </label>
                      <a
                        href="#"
                        className="font-medium text-primary-500 hover:underline"
                      >
                        Forgot Password?
                      </a>
                    </div>

                    {/* Sign In Button */}
                    <button className="w-full btn btn-secondary bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700">
                      Sign in
                    </button>

                    {/* Request Access */}
                    <p className="text-center mt-2">
                      Don't have an account?{" "}
                      <a
                        href="#"
                        className="text-primary-500 font-medium hover:underline"
                      >
                        Request Access
                      </a>
                    </p>

                    {/* Footer Links */}
                    <ul className="mt-10 flex flex-wrap justify-center gap-4 text-gray-200 [&_li_a]:font-medium [&_li_a]:text-gray-500 [&_li_a]:hover:text-gray-900 [&_li_a]:duration-150">
                      <li>
                        <a href="#">Privacy Policy</a>
                      </li>
                      <li>|</li>
                      <li>
                        <a href="#">Terms of Service</a>
                      </li>
                      <li>|</li>
                      <li>
                        <a href="#">Support</a>
                      </li>
                    </ul>
                  </div>
                </>
              )}

              {activeTab === "sso" && (
                <SsoSignIn />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
