"use client";

import Image from "next/image";

export default function Document() {
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
                { label: "Total Documents", value: 4, change: "23%", type: "up" },
                { label: "Approved", value: 3, change: "12%", type: "up" },
                { label: "Pending Review", value: 1, change: "2%", type: "up" },
                { label: "Total Downloads", value: 143, change: "8%", type: "down" },
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
                  />
                  <button className="w-8 h-8 !p-0 flex-none !flex justify-center items-center rounded-lg hover:bg-gray-100 absolute right-1 cursor-pointer">
                    <Image
                      src="/images/icons/search.svg"
                      alt="Search"
                      width={16}
                      height={16}
                    />
                  </button>
                </div>
              </li>

              {/* Status, Types, Modified */}
              {["Select Status", "Select Types", "Select Modified"].map((placeholder, index) => (
                <li
                  key={index}
                  className={`xl:flex-1 lg:w-2/8 md:w-2/6 w-2/4 px-1`}
                >
                  <select className={`form-control ${placeholder === "Select Types" ? "!pl-8" : ""}`}>
                    <option value="">{placeholder}</option>
                    <option value="1">{placeholder === "Select Modified" ? "Last Modified" : `All ${placeholder.split(' ')[1]}`}</option>
                  </select>
                </li>
              ))}

              <li className="px-1">
                <button className="btn btn-secondary">Apply Filters</button>
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
                  <span className="text-sm text-secondary-400">Showing 4 of 4 documents</span>
                </div>
                <select className="form-select form-select-sm !max-w-48 bg-white">
                  <option value="">Select Document</option>
                  <option value="">All Documents</option>
                </select>
              </div>
              <div className="panel-body w-full overflow-x-auto">
                <table className="table table-row-hover w-full">
                  <thead className="border-b border-gray-200">
                    <tr>
                      <th></th>
                      <th>Document</th>
                      <th>Autho</th>
                      <th>Version</th>
                      <th>Status</th>
                      <th>Last Modified</th>
                      <th className="text-center">Downloads</th>
                      <th className="text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {[...Array(4)].map((_, i) => (
                      <tr key={i}>
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
                                Q4 Financial Report 2024
                              </span>
                              <span className="text-xs font-medium text-nowrap">2 mb</span>
                            </div>
                          </div>
                        </td>
                        <td className="text-nowrap">
                          <div className="flex items-center gap-1">
                            <div className="size-8 rounded-full overflow-hidden flex justify-center items-center [&_img]:size-full [&_img]:object-cover">
                              <Image src="/images/avatar.jpg" alt="Author" width={24} height={24} />
                            </div>
                            <span className="font-semibold">Sarah Johnson</span>
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
                          <span className="px-3 py-1 inline-block text-xs font-semibold text-white rounded-full bg-yellow-500">
                            Pending
                          </span>
                        </td>
                        <td className="text-nowrap">
                          <span className="font-medium">15th Jan, 2024</span>
                        </td>
                        <td className="text-center">45</td>
                        <td>
                          <div className="flex justify-center items-center gap-1">
                            <button className="btn btn-primary-light !size-8 !p-0 !rounded-full !flex justify-center items-center">
                              <Image src="/images/icons/eye.svg" alt="View" width={16} height={16} />
                            </button>
                            <button className="btn btn-success-light !size-8 !p-0 !rounded-full !flex justify-center items-center">
                              <Image src="/images/icons/check.svg" alt="Approve" width={12} height={12} />
                            </button>
                            <button className="btn btn-danger-light !size-8 !p-0 !rounded-full !flex justify-center items-center">
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
  );
}
