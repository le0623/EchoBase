"use client";

import Image from "next/image";

export default function IntegrationsTab() {
  return (
    <div className="tab-content">
      <div className="space-y-4">
        {/* ===== Header ===== */}
        <div className="space-y-2">
          <div>
            <h3 className="mb-0 text-lg font-semibold text-gray-950">
              External Integrations
            </h3>
            <p className="text-gray-600">
              Connect with external services and APIs
            </p>
          </div>

          {/* ===== Integrations List ===== */}
          <div className="flex flex-wrap gap-y-4 -mx-2">
            {/* Microsoft 365 */}
            <div className="w-full px-2">
              <div className="p-4 rounded-lg border border-gray-200 flex flex-wrap justify-between items-center gap-3">
                <div className="flex gap-2 items-center">
                  <div className="size-12 flex-none flex justify-center items-center rounded-lg bg-gray-100">
                    <Image
                      src="/images/icons/microsoft365.png"
                      alt="Microsoft 365"
                      width={30}
                      height={30}
                    />
                  </div>
                  <div>
                    <h4 className="font-bold flex flex-wrap items-center gap-2">
                      Microsoft 365
                      <span className="px-3 py-1 text-xs font-semibold text-white rounded-full border border-primary-600 bg-primary-500 text-nowrap">
                        Connected
                      </span>
                    </h4>
                    <span className="text-sm font-medium text-gray-500">
                      SharePoint and Teams integration
                    </span>
                  </div>
                </div>

                <div className="inline-flex gap-1">
                  <button type="button" className="btn btn-secondary btn-sm">
                    Configure
                  </button>
                </div>
              </div>
            </div>

            {/* Active Directory */}
            <div className="w-full px-2">
              <div className="p-4 rounded-lg border border-gray-200 flex flex-wrap justify-between items-center gap-3">
                <div className="flex gap-2 items-center">
                  <div className="size-12 flex-none flex justify-center items-center rounded-lg bg-gray-100">
                    <Image
                      src="/images/icons/active-directory.png"
                      alt="Active Directory"
                      width={30}
                      height={30}
                    />
                  </div>
                  <div>
                    <h4 className="font-bold flex flex-wrap items-center gap-2">
                      Active Directory
                      <span className="px-3 py-1 text-xs font-semibold text-white rounded-full border border-primary-600 bg-primary-500 text-nowrap">
                        Connected
                      </span>
                    </h4>
                    <span className="text-sm font-medium text-gray-500">
                      User authentication and management
                    </span>
                  </div>
                </div>

                <div className="inline-flex gap-1">
                  <button type="button" className="btn btn-secondary btn-sm">
                    Configure
                  </button>
                </div>
              </div>
            </div>

            {/* Slack */}
            <div className="w-full px-2">
              <div className="p-4 rounded-lg border border-gray-200 flex flex-wrap justify-between items-center gap-3">
                <div className="flex gap-2 items-center">
                  <div className="size-12 flex-none flex justify-center items-center rounded-lg bg-gray-100">
                    <Image
                      src="/images/icons/slack.png"
                      alt="Slack"
                      width={30}
                      height={30}
                    />
                  </div>
                  <div>
                    <h4 className="font-bold flex flex-wrap items-center gap-2">
                      Slack
                      <span className="px-3 py-1 text-xs font-semibold text-gray-400 rounded-full border border-gray-200 bg-gray-50 text-nowrap">
                        Not Connected
                      </span>
                    </h4>
                    <span className="text-sm font-medium text-gray-500">
                      Team notifications and collaboration
                    </span>
                  </div>
                </div>

                <div className="inline-flex gap-1">
                  <button type="button" className="btn btn-secondary btn-sm">
                    Configure
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
