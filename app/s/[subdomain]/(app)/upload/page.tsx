"use client";

import { useState, ChangeEvent, useCallback } from "react";
import { formatFileSize } from "@/lib/s3";

interface ProcessingStep {
  name: string;
  status: 'pending' | 'processing' | 'completed';
}

export default function DocumentUpload() {
  const [files, setFiles] = useState<File[]>([]);
  const [documentName, setDocumentName] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const [processingSteps, setProcessingSteps] = useState<ProcessingStep[]>([]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []);
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const updateProcessingStep = useCallback((stepName: string, status: 'processing' | 'completed') => {
    setProcessingSteps((prev) =>
      prev.map((step) => step.name === stepName ? { ...step, status } : step)
    );
  }, []);

  const handleUpload = async () => {
    if (files.length === 0) {
      setError('Please select at least one file');
      return;
    }

    if (!documentName.trim()) {
      setError('Please enter a document name');
      return;
    }

    setIsUploading(true);
    setError("");
    setProcessingSteps([
      { name: 'Text extraction from file', status: 'pending' },
      { name: 'Content summarization', status: 'pending' },
      { name: 'Vector embedding generation', status: 'pending' },
      { name: 'Search index update', status: 'pending' },
    ]);

    try {
      // Upload each file
      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('name', documentName);
        formData.append('description', description);
        formData.append('tags', tags);

        // Start upload
        const response = await fetch('/api/documents/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Upload failed');
        }

        const result = await response.json();

        // Simulate processing steps with animation
        const steps = [
          'Text extraction from file',
          'Content summarization',
          'Vector embedding generation',
          'Search index update',
        ];

        for (const stepName of steps) {
          await new Promise(resolve => setTimeout(resolve, 800));
          updateProcessingStep(stepName, 'processing');
          await new Promise(resolve => setTimeout(resolve, 1200));
          updateProcessingStep(stepName, 'completed');
        }
      }

      // Success - clear form
      setFiles([]);
      setDocumentName("");
      setDescription("");
      setTags("");
      setProcessingSteps([]);
      
      alert('Documents uploaded successfully!');
    } catch (err: any) {
      setError(err.message || 'Failed to upload documents');
    } finally {
      setIsUploading(false);
      setProcessingSteps([]);
    }
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

            {/* Document Name Input */}
            <div>
              <label className="block text-base font-medium text-gray-700 mb-2">
                Document Name *
              </label>
              <input
                type="text"
                value={documentName}
                onChange={(e) => setDocumentName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter document name"
                disabled={isUploading}
              />
            </div>

            {/* Description Input */}
            <div>
              <label className="block text-base font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter document description"
                rows={3}
                disabled={isUploading}
              />
            </div>

            {/* Tags Input */}
            <div>
              <label className="block text-base font-medium text-gray-700 mb-2">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="tag1, tag2, tag3"
                disabled={isUploading}
              />
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
                  disabled={isUploading}
                />

                <ul id="file-list" className="mt-6 text-sm text-gray-700 space-y-2">
                  {files.map((file, idx) => (
                    <li key={idx} className="flex items-center justify-between px-4 py-2 bg-gray-50 rounded-lg">
                      <span>{file.name} ({formatFileSize(file.size)})</span>
                      <button
                        onClick={() => removeFile(idx)}
                        className="text-red-500 hover:text-red-700"
                        disabled={isUploading}
                      >
                        ✕
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              <button
                onClick={handleUpload}
                disabled={isUploading || files.length === 0 || !documentName.trim()}
                className="w-full bg-primary text-white py-4 rounded-lg font-semibold text-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploading ? 'Uploading...' : 'Upload Documents'}
              </button>

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
                {processingSteps.length > 0 ? (
                  processingSteps.map((step, idx) => (
                    <li key={idx}>
                      {step.status === 'completed' ? (
                        <img
                          src="images/icons/check.svg"
                          alt="check"
                          className="mt-1 icon-theme-green-500"
                        />
                      ) : step.status === 'processing' ? (
                        <div className="mt-1 w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <div className="mt-1 w-4 h-4 border-2 border-gray-300 rounded-full"></div>
                      )}
                      <span className={step.status === 'completed' ? 'text-green-600' : step.status === 'processing' ? 'text-blue-600 font-semibold' : 'text-gray-500'}>
                        {step.name}
                      </span>
                    </li>
                  ))
                ) : (
                  [
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
                  ))
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
