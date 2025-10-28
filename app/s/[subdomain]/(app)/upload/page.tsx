"use client";

import { useState, ChangeEvent } from "react";

export default function DocumentUpload() {
  const [files, setFiles] = useState<File[]>([]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []);
    setFiles((prev) => [...prev, ...newFiles]);
  };

  return (
    <div className="flex flex-col">
      <div className="flex flex-wrap gap-y-6 -mx-2">
        {/* Left Column */}
        <div className="lg:w-4/6 w-full px-2">
          <div className="p-4 rounded-xl border light-border bg-white h-full space-y-4">
            <div className="flex flex-wrap justify-between items-start gap-3">
              <div className="flex-1">
                <h3 className="xl:text-4xl lg:text-3xl md:text-2xl text-xl font-extrabold leading-[1.2]">
                  Document Upload
                </h3>
                <p className="font-medium text-gray-500">
                  Upload and process documents to make them searchable in your
                  knowledge base.
                </p>
              </div>
              <a
                href="#"
                className="btn !p-0 !size-8 !inline-flex gap-1 !justify-center !items-center text-nowrap"
              >
                <img
                  src="images/icons/three-dots-vertical.svg"
                  alt=""
                />
              </a>
            </div>

            {/* Drop Area */}
            <div className="space-y-5">
              <div
                id="drop-area"
                className="w-full p-10 mx-auto border-2 border-dashed border-gray-200 rounded-2xl text-center bg-white transition hover:border-gray-400"
              >
                <div className="text-gray-500 mb-4">
                  <img
                    src="images/icons/upload.svg"
                    alt="Upload"
                    className="w-10 inline-flex"
                  />
                </div>
                <h2 className="font-semibold text-lg text-gray-800 mb-2">
                  Drop files here or click to browse
                </h2>
                <p className="text-sm font-medium text-gray-400 mb-6">
                  Supports PDF, Word, PowerPoint, and Excel files up to 20MB
                </p>

                <label htmlFor="file-input" className="btn btn-primary !inline-flex gap-1">
                  <img src="images/icons/doc-2.svg" alt="" /> Browse Files
                </label>
                <input
                  id="file-input"
                  type="file"
                  className="hidden"
                  multiple
                  onChange={handleFileChange}
                />

                <ul id="file-list" className="mt-6 text-sm text-gray-700 space-y-1">
                  {files.map((file, idx) => (
                    <li key={idx}>{file.name}</li>
                  ))}
                </ul>
              </div>

              {/* Upload Guidelines */}
              <div className="space-y-3">
                <div className="flex gap-1 [&_img]:icon-primary-500">
                  <h4 className="xl:text-lg text-base font-bold text-secondary-700">
                    Upload Guidelines
                  </h4>
                </div>
                <ul className="flex flex-wrap gap-y-4 -mx-2 [&>*]:w-full sm:[&>*]:w-1/2 [&>*]:px-2 [&>*]:flex [&>*]:items-start [&>*]:gap-2">
                  {[
                    "Supported formats: PDF, DOCX, PPTX, XLSX",
                    "Maximum file size: 20MB per file",
                    "Clear document titles improve searchability",
                    "Tags help categorize and filter content",
                  ].map((item, idx) => (
                    <li key={idx}>
                      <img
                        src="images/icons/check.svg"
                        alt="check"
                        className="mt-1 icon-theme-green-500"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:w-2/6 w-full px-2">
          <div className="rounded-xl border light-border bg-white h-full p-4 space-y-6">
            <div className="flex flex-wrap justify-between items-start gap-3">
              <div className="flex-1">
                <h3 className="xl:text-3xl lg:text-2xl md:text-xl text-xl font-extrabold leading-[1.2]">
                  Processing Pipeline
                </h3>
                <p className="font-medium text-gray-500">
                  How your documents are processed
                </p>
              </div>
              <a
                href="#"
                className="btn btn-transparent !flex gap-1 justify-center items-center size-8 !p-0"
              >
                <img
                  src="images/icons/three-dots-vertical.svg"
                  alt=""
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
                <img
                  src="images/processing-pipeline.png"
                  alt=""
                  className="max-w-full inline-block lg:-mt-9"
                />
              </div>
            </div>

            <div className="space-y-3">
              <ul className="flex flex-wrap gap-y-4 -mx-2 [&>*]:w-full [&>*]:px-2 [&>*]:flex [&>*]:items-start [&>*]:gap-2">
                {[
                  "Text extraction from file",
                  "Content summarization",
                  "Vector embedding generation",
                  "Search index update",
                ].map((item, idx) => (
                  <li key={idx}>
                    <img
                      src="images/icons/check.svg"
                      alt="check"
                      className="mt-1 icon-theme-green-500"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
