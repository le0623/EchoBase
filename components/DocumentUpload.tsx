'use client';

import { useState, useRef } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { formatFileSize } from '@/lib/s3';
import UploadIcon from './icons/UploadIcon';

interface UploadFile {
  file: File;
  name: string;
  description: string;
  tags: string;
}

export default function DocumentUpload() {
  const [showModal, setShowModal] = useState(false);
  const [uploadFile, setUploadFile] = useState<UploadFile>({
    file: null as any,
    name: '',
    description: '',
    tags: '',
  });
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: async (data: UploadFile) => {
      const formData = new FormData();
      formData.append('file', data.file);
      formData.append('name', data.name);
      formData.append('description', data.description);
      formData.append('tags', data.tags);

      const response = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to upload document');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      setShowModal(false);
      setUploadFile({
        file: null as any,
        name: '',
        description: '',
        tags: '',
      });
    },
    onError: (error) => {
      console.error('Upload error:', error);
    },
  });

  const handleFileSelect = (file: File) => {
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      alert('File size must be less than 10MB');
      return;
    }

    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'text/plain',
      'text/csv',
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
    ];

    if (!allowedTypes.includes(file.type)) {
      alert('File type not supported. Please upload PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT, CSV, or image files.');
      return;
    }

    setUploadFile(prev => ({
      ...prev,
      file,
      name: file.name.split('.').slice(0, -1).join('.'),
    }));
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!uploadFile.file || !uploadFile.name.trim()) {
      alert('Please select a file and enter a name');
      return;
    }

    uploadMutation.mutate(uploadFile);
  };

  const resetForm = () => {
    setUploadFile({
      file: null as any,
      name: '',
      description: '',
      tags: '',
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <>
      <button
        className="btn btn-primary"
        onClick={() => setShowModal(true)}
      >
        <UploadIcon width={16} height={16} color="white" />
        Upload Document
      </button>

      {showModal && (
        <div className="modal modal-open">
          <div className="modal-box max-w-2xl">
            <h3 className="font-bold text-lg mb-4">Upload Document</h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* File Upload Area */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">File</span>
                </label>
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    dragActive 
                      ? 'border-primary bg-primary/10' 
                      : 'border-base-300 hover:border-base-content/20'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  {uploadFile.file ? (
                    <div className="space-y-2">
                      <p className="font-medium">{uploadFile.file.name}</p>
                      <p className="text-sm text-base-content/70">
                        {formatFileSize(uploadFile.file.size)}
                      </p>
                      <button
                        type="button"
                        className="btn btn-sm btn-ghost"
                        onClick={resetForm}
                      >
                        Remove File
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <UploadIcon width={48} height={48} color="#6b7280" />
                      <div>
                        <p className="font-medium">Drop your file here or click to browse</p>
                        <p className="text-sm text-base-content/70">
                          Supports PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT, CSV, and images
                        </p>
                        <p className="text-xs text-base-content/50 mt-1">
                          Maximum file size: 10MB
                        </p>
                      </div>
                      <button
                        type="button"
                        className="btn btn-outline"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        Choose File
                      </button>
                    </div>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  onChange={handleFileInputChange}
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.jpg,.jpeg,.png,.gif,.webp"
                />
              </div>

              {/* Document Name */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Document Name *</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter document name"
                  className="input input-bordered"
                  value={uploadFile.name}
                  onChange={(e) =>
                    setUploadFile(prev => ({ ...prev, name: e.target.value }))
                  }
                  required
                />
              </div>

              {/* Description */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Description</span>
                </label>
                <textarea
                  placeholder="Enter document description (optional)"
                  className="textarea textarea-bordered"
                  rows={3}
                  value={uploadFile.description}
                  onChange={(e) =>
                    setUploadFile(prev => ({ ...prev, description: e.target.value }))
                  }
                />
              </div>

              {/* Tags */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Tags</span>
                  <span className="label-text-alt">Separate tags with commas</span>
                </label>
                <input
                  type="text"
                  placeholder="tag1, tag2, tag3"
                  className="input input-bordered"
                  value={uploadFile.tags}
                  onChange={(e) =>
                    setUploadFile(prev => ({ ...prev, tags: e.target.value }))
                  }
                />
              </div>

              {/* Error Message */}
              {uploadMutation.error && (
                <div className="alert alert-error">
                  <span>{uploadMutation.error.message}</span>
                </div>
              )}

              {/* Actions */}
              <div className="modal-action">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setShowModal(false)}
                  disabled={uploadMutation.isPending}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={uploadMutation.isPending || !uploadFile.file || !uploadFile.name.trim()}
                >
                  {uploadMutation.isPending ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      Uploading...
                    </>
                  ) : (
                    'Upload Document'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
