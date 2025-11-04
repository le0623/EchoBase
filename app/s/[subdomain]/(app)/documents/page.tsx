"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { formatFileSize } from "@/lib/s3";

interface Document {
  id: string;
  name: string;
  originalName: string;
  description?: string;
  tags: string[];
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  version: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  submittedBy: {
    id: string;
    name?: string;
    email: string;
    profileImageUrl?: string;
  };
  approvedBy?: {
    id: string;
    name?: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface Stats {
  total: number;
  approved: number;
  pending: number;
  rejected: number;
}

export default function Document() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, approved: 0, pending: 0, rejected: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDocuments();
  }, [statusFilter]);

  const fetchDocuments = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (statusFilter) params.append('status', statusFilter);
      if (search) params.append('search', search);

      const response = await fetch(`/api/documents?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setDocuments(data.documents || []);
        
        // Calculate stats
        const total = data.documents?.length || 0;
        const approved = data.documents?.filter((doc: Document) => doc.status === 'APPROVED').length || 0;
        const pending = data.documents?.filter((doc: Document) => doc.status === 'PENDING').length || 0;
        const rejected = data.documents?.filter((doc: Document) => doc.status === 'REJECTED').length || 0;
        setStats({ total, approved, pending, rejected });
      } else {
        setError('Failed to load documents');
      }
    } catch (err) {
      setError('An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    fetchDocuments();
  };

  const getStatusBadge = (status: string) => {
    const classes = {
      'PENDING': 'bg-yellow-500',
      'APPROVED': 'bg-green-500',
      'REJECTED': 'bg-red-500',
    };
    return (
      <span className={`px-3 py-1 inline-block text-xs font-semibold text-white rounded-full ${classes[status as keyof typeof classes]}`}>
        {status}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="flex flex-col">
      <div className="flex flex-wrap gap-y-6 -mx-3">
        {/* Left Section */}
        <div className="lg:w-3/5 w-full px-3">
          <div className="h-full p-5 lg:pb-0 relative">
            <div className="rounded-xl absolute inset-0 bg-[#e4e4e4] overflow-hidden">
              <div className="w-[27vw] h-[11vw] rounded-[50%] bg-[#0198FF] blur-[100px] absolute top-[10vw] right-[10vw] rotate-[37deg] opacity-80"></div>
              <div className="w-[40vw] h-[18vw] rounded-[50%] bg-[#FEDCB6] blur-[130px] absolute top-[6vw] -right-[15vw] rotate-[50deg]"></div>
              <div className="w-[17vw] h-[11vw] rounded-[50%] bg-[#0198FF] blur-[70px] absolute top-[20vw] -right-[10vw] -rotate-[37deg] opacity-80"></div>
            </div>
            <div className="relative">
              <div className="flex flex-wrap gap-y-5">
                <div className="lg:-mt-9 md:w-1/2 md:order-last text-center">
                  <Image
                    src="/images/doc-folder.png"
                    alt="Document Folder"
                    width={400}
                    height={400}
                    className="max-w-full inline-block"
                  />
                </div>
                <div className="flex flex-col items-start justify-center space-y-5 md:w-1/2 md:order-first [&_strong]:text-primary-500">
                  <div>
                    <h2 className="xl:text-4xl lg:text-3xl md:text-2xl text-xl font-extrabold leading-[1.2]">
                      Document Library
                    </h2>
                    <p>Browse, search, and manage all your documents in one place</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="lg:w-2/5 w-full px-3">
          <div className="rounded-xl border light-border bg-white h-full p-4">
            <ul className="flex flex-wrap justify-between items-center sm:[&>*:nth-of-type(2n+1)]:border-r sm:[&>*:not(:nth-last-child(-n+2))]:border-b [&>*]:border-gray-200">
              {[
                { label: "Total Documents", value: stats.total, change: "0%", type: "up" },
                { label: "Approved", value: stats.approved, change: "0%", type: "up" },
                { label: "Pending Review", value: stats.pending, change: "0%", type: "up" },
                { label: "Rejected", value: stats.rejected, change: "0%", type: "down" },
              ].map((item, index) => (
                <li
                  key={index}
                  className="sm:w-1/2 w-full px-6 py-5 flex flex-col items-start"
                >
                  <span className="text-gray-500 text-sm font-medium">{item.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="xl:text-3xl lg:text-2xl text-xl font-extrabold text-gray-900">
                      {item.value}
                    </span>
                    <span
                      className={`text-sm font-bold flex ${item.type === "up" ? "text-green-600 [&_img]:icon-theme-green-500" : "text-red-600 [&_img]:icon-red-500"
                        }`}
                    >
                      <Image
                        src={`/images/icons/arrow-${item.type}ward.svg`}
                        alt={item.type === "up" ? "Up" : "Down"}
                        width={16}
                        height={16}
                      />
                      {item.change}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="w-full px-3">
          <div className="flex flex-col items-center gap-3">
            <div className="panel-header w-full flex flex-wrap justify-between items-center gap-3">
              <h3 className="mb-0 text-lg font-semibold text-gray-950">Search & Filters</h3>
            </div>
            <ul className="flex flex-wrap items-center -mx-1 gap-y-2 sticky top-16 z-10 w-full">
              <li className="xl:w-3/8 lg:w-2/8 md:w-2/6 w-2/4 px-1">
                <div className="flex items-center light-dark-icon relative">
                  <input
                    type="text"
                    placeholder="Search documents, conversations ..."
                    className="form-control !pr-10 !bg-transparent"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                  <button 
                    onClick={handleSearch}
                    className="w-8 h-8 !p-0 flex-none !flex justify-center items-center rounded-lg hover:bg-gray-100 absolute right-1 cursor-pointer"
                  >
                    <Image
                      src="/images/icons/search.svg"
                      alt="Search"
                      width={16}
                      height={16}
                    />
                  </button>
                </div>
              </li>

              {/* Status Filter */}
              <li className="xl:flex-1 lg:w-2/8 md:w-2/6 w-2/4 px-1">
                <select 
                  className="form-control"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="">All Status</option>
                  <option value="PENDING">Pending</option>
                  <option value="APPROVED">Approved</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </li>

              <li className="px-1">
                <button 
                  onClick={fetchDocuments}
                  className="btn btn-secondary"
                >
                  Refresh
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Documents Table */}
        <div className="w-full px-3">
          <div className="rounded-xl border light-border bg-white h-full p-4">
            <div className="flex flex-col items-center gap-3">
              <div className="panel-header w-full flex flex-wrap justify-between items-center gap-3">
                <div>
                  <h3 className="mb-0 text-lg font-semibold text-gray-950">Documents</h3>
                  <span className="text-sm text-secondary-400">
                    Showing {documents.length} {documents.length === 1 ? 'document' : 'documents'}
                  </span>
                </div>
              </div>
              <div className="panel-body w-full overflow-x-auto">
                {isLoading ? (
                  <div className="flex justify-center py-10">
                    <div className="w-8 h-8 border-4 border-gray-200 border-t-primary rounded-full animate-spin"></div>
                  </div>
                ) : error ? (
                  <div className="text-center py-10 text-red-600">{error}</div>
                ) : documents.length === 0 ? (
                  <div className="text-center py-10 text-gray-500">No documents found</div>
                ) : (
                  <table className="table table-row-hover w-full">
                    <thead className="border-b border-gray-200">
                      <tr>
                        <th></th>
                        <th>Document</th>
                        <th>Author</th>
                        <th>Version</th>
                        <th>Status</th>
                        <th>Last Modified</th>
                        <th className="text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {documents.map((doc) => (
                        <tr key={doc.id}>
                          <td width="24">
                            <button className="bg-transparent size-6 cursor-pointer [&_img]:icon-yellow-500">
                              <Image src="/images/icons/star-fill.svg" alt="Star" width={16} height={16} />
                            </button>
                          </td>
                          <td>
                            <div className="flex items-start gap-2">
                              <div className="size-10 flex justify-center items-center rounded-full border border-gray-200 bg-gray-100">
                                <Image src="/images/icons/doc.svg" alt="Document" width={24} height={24} />
                              </div>
                              <div className="flex flex-col flex-start gap-y-1">
                                <span className="text-sm font-semibold text-wrap break-all">
                                  {doc.name}
                                </span>
                                <span className="text-xs font-medium text-nowrap">{formatFileSize(doc.fileSize)}</span>
                                {doc.tags && doc.tags.length > 0 && (
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {doc.tags.slice(0, 2).map((tag, idx) => (
                                      <span key={idx} className="px-2 py-0.5 text-xs font-semibold rounded-full border border-gray-200 bg-gray-50">
                                        {tag}
                                      </span>
                                    ))}
                                    {doc.tags.length > 2 && (
                                      <span className="text-xs text-gray-500">+{doc.tags.length - 2}</span>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="text-nowrap">
                            <div className="flex items-center gap-1">
                              <div className="size-8 rounded-full overflow-hidden flex justify-center items-center bg-gray-100">
                                {doc.submittedBy.profileImageUrl ? (
                                  <Image 
                                    src={doc.submittedBy.profileImageUrl} 
                                    alt="Author" 
                                    width={32} 
                                    height={32}
                                    className="rounded-full"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs font-bold">
                                    {doc.submittedBy.name ? doc.submittedBy.name[0] : doc.submittedBy.email[0].toUpperCase()}
                                  </div>
                                )}
                              </div>
                              <span className="font-semibold">{doc.submittedBy.name || doc.submittedBy.email}</span>
                            </div>
                          </td>
                          <td className="text-nowrap">
                            <div className="flex gap-1">
                              <span className="px-3 py-0.5 text-xs font-semibold rounded-full border border-gray-200 bg-gray-50">
                                V{doc.version}
                              </span>
                            </div>
                          </td>
                          <td>
                            {getStatusBadge(doc.status)}
                          </td>
                          <td className="text-nowrap">
                            <span className="font-medium">{formatDate(doc.updatedAt)}</span>
                          </td>
                          <td>
                            <div className="flex justify-center items-center gap-1">
                              <button 
                                className="btn btn-primary-light !size-8 !p-0 !rounded-full !flex justify-center items-center"
                                onClick={() => window.open(doc.fileUrl, '_blank')}
                              >
                                <Image src="/images/icons/eye.svg" alt="View" width={16} height={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
