"use client";

import Image from "next/image";

export default function GeneralTab() {
  return (
    <div className="tab-content">
      <div className="space-y-6">
        {/* ============ GENERAL CONFIGURATION ============ */}
        <div className="space-y-3">
          <div>
            <h3 className="mb-0 text-lg font-semibold text-gray-950">
              General Configuration
            </h3>
            <p className="text-gray-600">Basic system settings and preferences</p>
          </div>

          <div className="flex flex-wrap gap-y-4 -mx-2">
            {/* Organization Name */}
            <div className="sm:w-1/2 w-full px-2">
              <input
                type="text"
                placeholder="Organization Name"
                className="form-control w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            {/* Administrator Email */}
            <div className="sm:w-1/2 w-full px-2">
              <input
                type="email"
                placeholder="Administrator Email"
                className="form-control w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            {/* Description */}
            <div className="w-full px-2">
              <textarea
                id="description"
                rows={6}
                placeholder="Organization Description"
                className="form-control w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              ></textarea>
            </div>
          </div>
        </div>

        {/* ============ SYSTEM PREFERENCES ============ */}
        <div className="space-y-3">
          <div>
            <h3 className="mb-0 text-lg font-semibold text-gray-950">
              System Preferences
            </h3>
          </div>

          <div className="flex flex-wrap gap-y-4 -mx-2">
            {/* Dark Mode */}
            <div className="w-full px-2">
              <div className="p-4 rounded-lg border border-gray-200 flex flex-wrap items-center gap-3">
                <div className="flex gap-2 items-center">
                  <div className="size-12 flex justify-center items-center rounded-lg bg-gray-100">
                    <Image
                      src="/images/icons/dark-mode.svg"
                      alt="Dark Mode"
                      width={30}
                      height={30}
                    />
                  </div>
                  <div>
                    <h4 className="font-bold">Dark Mode</h4>
                    <span className="text-sm font-medium text-gray-500">
                      Enable dark theme for the interface
                    </span>
                  </div>
                </div>

                <label className="inline-flex items-center gap-2 cursor-pointer ml-auto">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="input-switch"></div>
                </label>
              </div>
            </div>

            {/* Auto Document Approval */}
            <div className="w-full px-2">
              <div className="p-4 rounded-lg border border-gray-200 flex flex-wrap items-center gap-3">
                <div className="flex gap-2 items-center">
                  <div className="size-12 flex justify-center items-center rounded-lg bg-gray-100">
                    <Image
                      src="/images/icons/doc-2.svg"
                      alt="Auto Document Approval"
                      width={30}
                      height={30}
                    />
                  </div>
                  <div>
                    <h4 className="font-bold">Auto Document Approval</h4>
                    <span className="text-sm font-medium text-gray-500">
                      Automatically approve documents from trusted users
                    </span>
                  </div>
                </div>

                <label className="inline-flex items-center gap-2 cursor-pointer ml-auto">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="input-switch"></div>
                </label>
              </div>
            </div>

            {/* Retention Period */}
            <div className="w-full px-2">
              <div className="p-4 rounded-lg border border-gray-200 flex flex-wrap items-center gap-3">
                <div className="flex gap-2 items-center">
                  <div className="size-12 flex justify-center items-center rounded-lg bg-gray-100">
                    <Image
                      src="/images/icons/doc-2.svg"
                      alt="Default Document Retention Period"
                      width={30}
                      height={30}
                    />
                  </div>
                  <div>
                    <h4 className="font-bold">
                      Default Document Retention Period
                    </h4>
                    <span className="text-sm font-medium text-gray-500">
                      Automatically approve documents from trusted users
                    </span>
                  </div>
                </div>

                <select className="form-select form-select-sm !max-w-32 bg-white ml-auto">
                  <option>Select year</option>
                  <option selected>5 years</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
