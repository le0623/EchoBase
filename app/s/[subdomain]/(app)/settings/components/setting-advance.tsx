"use client";

export default function AdvancedTab() {
  return (
    <div className="tab-content">
      <div className="space-y-4">
        {/* ================= Advanced Configuration ================= */}
        <div className="space-y-2">
          <div>
            <h3 className="mb-0 text-lg font-semibold text-gray-950">
              Advanced Configuration
            </h3>
            <p className="text-gray-600">
              System-level settings and maintenance options
            </p>
          </div>

          <div className="flex flex-wrap gap-y-4 -mx-2">
            {/* Database Backup Frequency */}
            <div className="sm:w-1/2 w-full px-2">
              <div className="p-4 rounded-lg border border-gray-200 flex flex-wrap items-center gap-3">
                <div className="flex gap-2">
                  <div>
                    <h4 className="font-bold">Database Backup Frequency</h4>
                  </div>
                </div>

                <select
                  className="form-select form-select-sm !max-w-32 bg-white ml-auto"
                >
                  <option value="">Daily</option>
                  <option value="">Weekly</option>
                  <option value="">Monthly</option>
                </select>
              </div>
            </div>

            {/* Maximum File Size */}
            <div className="sm:w-1/2 w-full px-2">
              <div className="p-4 rounded-lg border border-gray-200 flex flex-wrap items-center gap-3">
                <div className="flex gap-2">
                  <div>
                    <h4 className="font-bold">Maximum File Size (MB)</h4>
                  </div>
                </div>

                <select
                  className="form-select form-select-sm !max-w-32 bg-white ml-auto"
                >
                  <option value="">100</option>
                  <option value="">500</option>
                  <option value="">1000</option>
                </select>
              </div>
            </div>

            {/* Search Index Refresh Rate */}
            <div className="sm:w-1/2 w-full px-2">
              <div className="p-4 rounded-lg border border-gray-200 flex flex-wrap items-center gap-3">
                <div className="flex gap-2">
                  <div>
                    <h4 className="font-bold">Search Index Refresh Rate</h4>
                  </div>
                </div>

                <select
                  className="form-select form-select-sm !max-w-32 bg-white ml-auto"
                >
                  <option value="">5 Minutes</option>
                  <option value="">10 Minutes</option>
                  <option value="">15 Minutes</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* ================= Danger Zone ================= */}
        <div className="space-y-2">
          <div>
            <h3 className="mb-0 text-lg font-semibold text-gray-950">
              Danger Zone
            </h3>
            <p className="text-gray-600">
              System-level settings and maintenance options
            </p>
          </div>

          <div className="flex flex-wrap gap-y-4 -mx-2">
            {/* Clear All Cache */}
            <div className="w-full px-2">
              <div className="p-4 rounded-lg border border-gray-200 flex flex-wrap justify-between items-center gap-3">
                <div className="flex gap-2">
                  <div>
                    <h4 className="font-bold">Clear All Cache</h4>
                    <span className="text-sm font-medium text-gray-500">
                      Remove all cached data to improve performance
                    </span>
                  </div>
                </div>

                <div className="inline-flex gap-1">
                  <button type="button" className="btn btn-secondary btn-sm">
                    Clear Cache
                  </button>
                </div>
              </div>
            </div>

            {/* Reset All Settings */}
            <div className="w-full px-2">
              <div className="p-4 rounded-lg border border-gray-200 flex flex-wrap justify-between items-center gap-3">
                <div className="flex gap-2">
                  <div>
                    <h4 className="font-bold">Reset All Settings</h4>
                    <span className="text-sm font-medium text-gray-500">
                      Restore all settings to default values
                    </span>
                  </div>
                </div>

                <div className="inline-flex gap-1">
                  <button type="button" className="btn btn-secondary btn-sm">
                    Reset Settings
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
