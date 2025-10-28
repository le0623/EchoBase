"use client";

import {
  ArrowUp,
  ArrowDown,
  Eye,
  Check,
  X,
  FileText,
  UserCircle,
} from "lucide-react";

import Image from "next/image";

export default function DocumentApproval() {
  return (
    <div className="flex flex-col">
      <div className="flex flex-wrap gap-y-6 -mx-3">
        {/* Left Section */}
        <div className="lg:w-3/5 w-full px-3">
          <div className="h-full p-5 lg:pb-0 relative">
            {/* Background gradient blobs */}
            <div className="rounded-xl absolute inset-0 bg-[#e4e4e4] overflow-hidden">
              <div className="w-[27vw] h-[11vw] rounded-[50%] bg-[#0198FF] blur-[100px] absolute top-[10vw] right-[10vw] rotate-[37deg] opacity-80"></div>
              <div className="w-[40vw] h-[18vw] rounded-[50%] bg-[#FEDCB6] blur-[130px] absolute top-[6vw] -right-[15vw] rotate-[50deg]"></div>
              <div className="w-[17vw] h-[11vw] rounded-[50%] bg-[#0198FF] blur-[70px] absolute top-[20vw] -right-[10vw] -rotate-[37deg] opacity-80"></div>
            </div>

            {/* Content */}
            <div className="relative">
              <div className="flex flex-wrap gap-y-5">
                <div className="lg:-mt-9 md:w-1/2 md:order-last text-center">
                  <div className="inline-flex items-center justify-center w-40 h-40 bg-gray-100 rounded-full">
                    <FileText className="w-20 h-20 text-blue-500" />
                  </div>
                </div>
                <div className="flex flex-col items-start justify-center space-y-5 md:w-1/2 md:order-first">
                  <h2 className="xl:text-4xl lg:text-3xl md:text-2xl text-xl font-extrabold leading-[1.2]">
                    Document Approval
                  </h2>
                  <p>Review and approve submitted documents</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Stats */}
        <div className="lg:w-2/5 w-full px-3">
          <div className="rounded-xl border light-border bg-white h-full p-4">
            <ul className="flex flex-wrap justify-between items-center sm:[&>*:nth-of-type(2n+1)]:border-r sm:[&>*:not(:nth-last-child(-n+2))]:border-b [&>*]:border-gray-200">
              {/* Pending */}
              <li className="sm:w-1/2 w-full px-6 py-5 flex flex-col items-start">
                <span className="text-gray-500 text-sm font-medium">
                  Pending
                </span>
                <div className="flex items-center gap-2">
                  <span className="xl:text-3xl lg:text-2xl text-xl font-extrabold text-gray-900">
                    10
                  </span>
                  <span className="text-sm text-green-600 font-bold flex items-center gap-1">
                    <ArrowUp size={16} /> 23%
                  </span>
                </div>
              </li>

              {/* Reviewing */}
              <li className="sm:w-1/2 w-full px-6 py-5 flex flex-col items-start">
                <span className="text-gray-500 text-sm font-medium">
                  Reviewing
                </span>
                <div className="flex items-center gap-2">
                  <span className="xl:text-3xl lg:text-2xl text-xl font-extrabold text-gray-900">
                    10
                  </span>
                  <span className="text-sm text-red-600 font-bold flex items-center gap-1">
                    <ArrowDown size={16} /> 8%
                  </span>
                </div>
              </li>

              {/* Approved */}
              <li className="sm:w-1/2 w-full px-6 py-5 flex flex-col items-start">
                <span className="text-gray-500 text-sm font-medium">
                  Approved
                </span>
                <div className="flex items-center gap-2">
                  <span className="xl:text-3xl lg:text-2xl text-xl font-extrabold text-gray-900">
                    10
                  </span>
                  <span className="text-sm text-green-600 font-bold flex items-center gap-1">
                    <ArrowUp size={16} /> 12%
                  </span>
                </div>
              </li>

              {/* Rejected */}
              <li className="sm:w-1/2 w-full px-6 py-5 flex flex-col items-start">
                <span className="text-gray-500 text-sm font-medium">
                  Rejected
                </span>
                <div className="flex items-center gap-2">
                  <span className="xl:text-3xl lg:text-2xl text-xl font-extrabold text-gray-900">
                    15
                  </span>
                  <span className="text-sm text-green-600 font-bold flex items-center gap-1">
                    <ArrowUp size={16} /> 2%
                  </span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Table Section */}
        <div className="w-full px-3">
          <div className="rounded-xl border light-border bg-white h-full p-4">
            <div className="flex flex-col items-center gap-3">
              <div className="panel-header w-full flex flex-wrap justify-between items-center gap-3">
                <div>
                  <h3 className="mb-0 text-lg font-semibold text-gray-950">
                    Documents for Review
                  </h3>
                  <span className="text-sm text-secondary-400">
                    Showing all documents
                  </span>
                </div>
                <select className="form-select form-select-sm !max-w-48 bg-white">
                  <option>Select Document</option>
                  <option>All Documents</option>
                </select>
              </div>

              <div className="panel-body w-full">
                <div className="overflow-x-auto">
                  <table className="table table-row-hover w-full">
                    <thead className="border-b border-gray-200">
                      <tr>
                        <th>Document</th>
                        <th>Submitted By</th>
                        <th>Version</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th className="text-center">Action</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200">
                      {[1, 2, 3].map((_, idx) => (
                        <tr key={idx}>
                          <td>
                            <div className="flex items-start gap-2">
                              <div className="size-10 flex justify-center items-center rounded-full border border-gray-200 bg-gray-100">
                                <FileText size={20} />
                              </div>
                              <div className="flex flex-col flex-start gap-y-1">
                                <span className="text-sm font-semibold">
                                  Q4 Financial Report 2024
                                </span>
                                <span className="text-xs font-medium">
                                  {idx === 0 ? "2 mb" : "2.4 mb"}
                                </span>
                                <ul className="inline-flex flex-wrap items-center gap-2">
                                  {["finance", "quarterly", "revenue"].map(
                                    (tag) => (
                                      <li key={tag}>
                                        <span className="px-2 py-0.5 text-xs font-semibold rounded-full border border-gray-200 bg-gray-50">
                                          {tag}
                                        </span>
                                      </li>
                                    )
                                  )}
                                </ul>
                              </div>
                            </div>
                          </td>
                          <td className="text-nowrap">
                            <div className="flex items-center gap-1">
                              <UserCircle className="w-6 h-6 text-gray-400" />
                              <span className="font-semibold">
                                Sarah Johnson
                              </span>
                            </div>
                          </td>
                          <td className="text-nowrap">
                            <div className="flex gap-1">
                              <span className="px-3 py-0.5 text-xs font-semibold rounded-full border border-gray-200 bg-gray-50">
                                V2
                              </span>{" "}
                              (1 previous)
                            </div>
                          </td>
                          <td>
                            <span
                              className={`px-3 py-1 inline-block text-xs font-semibold text-white rounded-full ${idx === 0
                                ? "bg-yellow-500"
                                : idx === 1
                                  ? "bg-green-500"
                                  : "bg-red-500"
                                }`}
                            >
                              {idx === 0
                                ? "Pending"
                                : idx === 1
                                  ? "Approved"
                                  : "Rejected"}
                            </span>
                          </td>
                          <td className="text-nowrap">
                            <span className="font-medium">
                              15th Jan, 2024
                            </span>
                          </td>
                          <td>
                            <div className="flex justify-center items-center gap-1">
                              <button className="btn btn-primary-light !size-8 !p-0 !rounded-full !flex !justify-center !items-center">
                                <Image src="/images/icons/eye.svg" alt="View" width={16} height={16} />
                              </button>
                              <button className="btn btn-success-light !size-8 !p-0 !rounded-full !flex !justify-center !items-center">
                                <Image src="/images/icons/check.svg" alt="Approve" width={12} height={12} />
                              </button>
                              <button className="btn btn-danger-light !size-8 !p-0 !rounded-full !flex !justify-center !items-center">
                                <Image src="/images/icons/close.svg" alt="Reject" width={16} height={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
