"use client";

import Image from "next/image";

export default function SecurityTab() {
  return (
    <div className="tab-content">
      <div className="space-y-6">
        {/* ========== SECURITY SETTINGS ========== */}
        <div>
          <h3 className="mb-0 text-lg font-semibold text-gray-950">
            Security Settings
          </h3>
          <p className="text-gray-600">
            Configure authentication and access control
          </p>
        </div>

        {/* Authentication Options */}
        <div className="flex flex-wrap gap-y-4 -mx-2">
          {/* Two-Factor Authentication */}
          <div className="w-full px-2">
            <div className="p-4 rounded-lg border border-gray-200 flex flex-wrap items-center gap-3">
              <div className="flex gap-2 items-center">
                <div className="size-12 flex justify-center items-center rounded-lg bg-gray-100">
                  <Image
                    src="/images/icons/authentication.svg"
                    alt="Two-Factor Authentication"
                    width={30}
                    height={30}
                  />
                </div>
                <div>
                  <h4 className="font-bold">Two-Factor Authentication</h4>
                  <span className="text-sm font-medium text-gray-500">
                    Require 2FA for all admin users
                  </span>
                </div>
              </div>

              <label className="inline-flex items-center gap-2 cursor-pointer ml-auto">
                <input type="checkbox" className="sr-only peer" />
                <div className="input-switch"></div>
              </label>
            </div>
          </div>

          {/* Single Sign-On */}
          <div className="w-full px-2">
            <div className="p-4 rounded-lg border border-gray-200 flex flex-wrap items-center gap-3">
              <div className="flex gap-2 items-center">
                <div className="size-12 flex justify-center items-center rounded-lg bg-gray-100">
                  <Image
                    src="/images/icons/sso.svg"
                    alt="Single Sign-On (SSO)"
                    width={30}
                    height={30}
                  />
                </div>
                <div>
                  <h4 className="font-bold">Single Sign-On (SSO)</h4>
                  <span className="text-sm font-medium text-gray-500">
                    Enable Microsoft SSO integration
                  </span>
                </div>
              </div>

              <label className="inline-flex items-center gap-2 cursor-pointer ml-auto">
                <input type="checkbox" className="sr-only peer" />
                <div className="input-switch"></div>
              </label>
            </div>
          </div>

          {/* Session Timeout */}
          <div className="w-full px-2">
            <div className="p-4 rounded-lg border border-gray-200 flex flex-wrap items-center gap-3">
              <div className="flex gap-2 items-center">
                <div className="size-12 flex justify-center items-center rounded-lg bg-gray-100">
                  <Image
                    src="/images/icons/session-timeout.svg"
                    alt="Session Timeout"
                    width={30}
                    height={30}
                  />
                </div>
                <div>
                  <h4 className="font-bold">Session Timeout</h4>
                  <span className="text-sm font-medium text-gray-500">
                    Automatically approve documents from trusted users
                  </span>
                </div>
              </div>

              <select className="form-select form-select-sm !max-w-32 bg-white ml-auto border border-gray-300 rounded-md text-sm px-2 py-1">
                <option>Duration</option>
                <option>4 hours</option>
              </select>
            </div>
          </div>
        </div>

        {/* ========== PASSWORD POLICY ========== */}
        <div className="rounded-xl border light-border bg-white h-full p-4">
          <div className="space-y-2">
            <h4 className="text-lg font-semibold text-gray-950">
              Password Policy
            </h4>
            <ul className="inline-flex flex-wrap items-center gap-1">
              <li>
                <span className="px-3 py-1 text-xs font-semibold rounded-full border border-gray-200 bg-gray-50">
                  Minimum 8 characters
                </span>
              </li>
              <li>
                <span className="px-3 py-1 text-xs font-semibold rounded-full border border-gray-200 bg-gray-50">
                  Require uppercase and lowercase letters
                </span>
              </li>
              <li>
                <span className="px-3 py-1 text-xs font-semibold rounded-full border border-gray-200 bg-gray-50">
                  Require numbers and special characters
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* ========== ACCESS CONTROL ========== */}
        <div className="space-y-4">
          <div className="flex flex-wrap justify-between items-start gap-4">
            <div>
              <h3 className="mb-0 text-lg font-semibold text-gray-950">
                Access Control
              </h3>
              <p className="text-gray-600">Manage user roles and permissions</p>
            </div>
            <button className="btn btn-secondary inline-flex gap-1 text-white bg-gray-800 hover:bg-black px-4 py-2 rounded-lg">
              Manage Roles
            </button>
          </div>

          <div className="flex flex-wrap gap-y-4 -mx-2">
            {/* Administrator */}
            <div className="md:w-1/3 sm:w-1/2 w-full px-2">
              <div className="p-4 h-full rounded-lg border border-gray-200 flex justify-between items-start gap-3">
                <div>
                  <h4 className="font-bold">Administrator</h4>
                  <span className="text-sm text-gray-500">
                    Full system access
                  </span>
                </div>
                <span className="px-3 py-1 text-xs font-semibold text-white rounded-full border border-primary-600 bg-primary-500 text-nowrap">
                  12 users
                </span>
              </div>
            </div>

            {/* Editor */}
            <div className="md:w-1/3 sm:w-1/2 w-full px-2">
              <div className="p-4 h-full rounded-lg border border-gray-200 flex justify-between items-start gap-3">
                <div>
                  <h4 className="font-bold">Editor</h4>
                  <span className="text-sm text-gray-500">
                    Can upload and edit documents
                  </span>
                </div>
                <span className="px-3 py-1 text-xs font-semibold text-white rounded-full border border-primary-600 bg-primary-500 text-nowrap">
                  45 users
                </span>
              </div>
            </div>

            {/* Viewer */}
            <div className="md:w-1/3 sm:w-1/2 w-full px-2">
              <div className="p-4 h-full rounded-lg border border-gray-200 flex justify-between items-start gap-3">
                <div>
                  <h4 className="font-bold">Viewer</h4>
                  <span className="text-sm text-gray-500">
                    Read-only access
                  </span>
                </div>
                <span className="px-3 py-1 text-xs font-semibold text-white rounded-full border border-primary-600 bg-primary-500 text-nowrap">
                  132 users
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
