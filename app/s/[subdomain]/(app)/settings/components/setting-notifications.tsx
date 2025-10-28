"use client";

import Image from "next/image";

export default function NotificationTab() {
  return (
    <div className="tab-content">
      <div className="space-y-4">
        {/* ===== Header ===== */}
        <div className="space-y-2">
          <div>
            <h3 className="mb-0 text-lg font-semibold text-gray-950">
              Notification Preferences
            </h3>
            <p className="text-gray-600">
              Configure how and when you receive notifications
            </p>
          </div>

          {/* ===== Notification Options ===== */}
          <div className="flex flex-wrap gap-y-4 -mx-2">
            {/* Email Notifications */}
            <div className="w-full px-2">
              <div className="p-4 rounded-lg border border-gray-200 flex flex-wrap justify-between items-center gap-3">
                <div className="flex gap-2 items-center">
                  <div className="size-12 flex-none flex justify-center items-center rounded-lg bg-gray-100">
                    <Image
                      src="/images/icons/envelope.svg"
                      alt="Email Notifications"
                      width={30}
                      height={30}
                    />
                  </div>
                  <div>
                    <h4 className="font-bold">Email Notifications</h4>
                    <span className="text-sm font-medium text-gray-500">
                      Receive email alerts for important events
                    </span>
                  </div>
                </div>

                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="input-switch"></div>
                </label>
              </div>
            </div>

            {/* Push Notifications */}
            <div className="w-full px-2">
              <div className="p-4 rounded-lg border border-gray-200 flex flex-wrap justify-between items-center gap-3">
                <div className="flex gap-2 items-center">
                  <div className="size-12 flex-none flex justify-center items-center rounded-lg bg-gray-100">
                    <Image
                      src="/images/icons/bell-2.svg"
                      alt="Push Notifications"
                      width={30}
                      height={30}
                    />
                  </div>
                  <div>
                    <h4 className="font-bold">Push Notifications</h4>
                    <span className="text-sm font-medium text-gray-500">
                      Browser push notifications for real-time updates
                    </span>
                  </div>
                </div>

                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="input-switch"></div>
                </label>
              </div>
            </div>

            {/* Email Notification Types */}
            <div className="w-full px-2">
              <div className="p-4 rounded-lg border border-gray-200 space-y-2">
                <div className="flex gap-2 items-center">
                  <h4 className="text-base font-bold">
                    Email Notification Types
                  </h4>
                </div>

                <ul className="divide-y divide-gray-200">
                  {/* Document approval requests */}
                  <li className="py-4 flex flex-wrap justify-between items-center gap-3">
                    <span className="text-gray-500">
                      Document approval requests
                    </span>
                    <label className="inline-flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="input-switch"></div>
                    </label>
                  </li>

                  {/* New document uploads */}
                  <li className="py-4 flex flex-wrap justify-between items-center gap-3">
                    <span className="text-gray-500">New document uploads</span>
                    <label className="inline-flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="input-switch"></div>
                    </label>
                  </li>

                  {/* System maintenance alerts */}
                  <li className="py-4 flex flex-wrap justify-between items-center gap-3">
                    <span className="text-gray-500">
                      System maintenance alerts
                    </span>
                    <label className="inline-flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="input-switch"></div>
                    </label>
                  </li>

                  {/* Weekly usage reports */}
                  <li className="py-4 flex flex-wrap justify-between items-center gap-3">
                    <span className="text-gray-500">Weekly usage reports</span>
                    <label className="inline-flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="input-switch"></div>
                    </label>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
