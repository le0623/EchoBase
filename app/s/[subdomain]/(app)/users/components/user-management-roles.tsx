import Image from "next/image";
import { useState } from "react";



export default function RolesTab() {
    const [selectedRole, setSelectedRole] = useState("");

    

  return (
       <div className="tab-content space-y-5">
        <div className="space-y-5">
      {/* Top Controls */}
      <div className="w-full flex flex-wrap justify-between items-center gap-3">
        <div className="flex items-center gap-3">
          <span className="mb-0 font-semibold text-gray-950 text-nowrap">Select Role</span>
          <select
            name="role"
            id="role"
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="form-select form-select-sm !max-w-48 bg-white border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary-500"
          >
            <option value="">Select Administrator</option>
            <option value="all">All Administrators</option>
          </select>
        </div>

        <button
          className="btn btn-primary btn-sm !inline-flex gap-1 !justify-start"
          onClick={() => alert("Create Custom Role clicked")}
        >
          <Image
            src="/images/icons/plus.svg"
            alt="Add"
            width={14}
            height={14}
          />
          Create Custom Role
        </button>
      </div>

      {/* Role Card */}
      <div className="flex items-center gap-2 p-4 rounded-lg bg-gray-100">
        <div className="size-12 rounded-full overflow-hidden flex justify-center items-center">
          <Image
            src="/images/avatar.jpg"
            alt="User Avatar"
            width={48}
            height={48}
            className="object-cover"
          />
        </div>
        <div className="flex flex-col">
          <span className="font-semibold">
            Sarah Johnson{" "}
            <span className="ml-1 px-3 py-1 inline-block text-xs font-semibold text-white rounded-full bg-emerald-500">
              Editor
            </span>
          </span>
          <span className="text-xs text-gray-500">
            Full system access with all permissions
          </span>
        </div>
      </div>

       <div>
      <h3 className="xl:text-xl text-lg font-bold text-secondary-700">
        Permissions
      </h3>
      <p className="text-sm font-medium text-gray-500">
        Configure what users with this role can access and do
      </p>
    </div>



     <div className="space-y-5">
      <div className="space-y-2">
        <div className="flex gap-1 [&_img]:icon-primary-500">
          <img
            src="/images/icons/doc-2.svg"
            alt="Document Management"
            width={24}
          />
          <h4 className="xl:text-lg text-base font-bold text-secondary-700">
            Document Management
          </h4>
        </div>

         <div className="flex flex-wrap gap-y-4 -mx-2">
      <div className="sm:w-1/2 w-full px-2">
        <div className="p-4 rounded-lg border border-gray-200 flex flex-wrap gap-3">
          <div>
            <h4 className="font-bold">View Documents</h4>
            <span className="text-sm text-gray-500">Access to view all documents</span>
          </div>
          <label className="inline-flex items-center gap-2 cursor-pointer ml-auto">
            <input type="checkbox" className="sr-only peer" />
            <div className="input-switch"></div>
          </label>
        </div>
      </div>

      <div className="sm:w-1/2 w-full px-2">
        <div className="p-4 rounded-lg border border-gray-200 flex flex-wrap gap-3">
          <div>
            <h4 className="font-bold">Upload Documents</h4>
            <span className="text-sm text-gray-500">Upload new documents to the system</span>
          </div>
          <label className="inline-flex items-center gap-2 cursor-pointer ml-auto">
            <input type="checkbox" className="sr-only peer" />
            <div className="input-switch"></div>
          </label>
        </div>
      </div>

      <div className="sm:w-1/2 w-full px-2">
        <div className="p-4 rounded-lg border border-gray-200 flex flex-wrap gap-3">
          <div>
            <h4 className="font-bold">Edit Documents</h4>
            <span className="text-sm text-gray-500">Modify document metadata and content</span>
          </div>
          <label className="inline-flex items-center gap-2 cursor-pointer ml-auto">
            <input type="checkbox" className="sr-only peer" />
            <div className="input-switch"></div>
          </label>
        </div>
      </div>

      <div className="sm:w-1/2 w-full px-2">
        <div className="p-4 rounded-lg border border-gray-200 flex flex-wrap gap-3">
          <div>
            <h4 className="font-bold">Delete Documents</h4>
            <span className="text-sm text-gray-500">Remove documents from the system</span>
          </div>
          <label className="inline-flex items-center gap-2 cursor-pointer ml-auto">
            <input type="checkbox" className="sr-only peer" />
            <div className="input-switch"></div>
          </label>
        </div>
      </div>
    </div>
      </div>

      <div className="space-y-2">
      <div className="flex gap-1 [&_img]:icon-primary-500">
        <img src="images/icons/users.svg" alt="User Management" width={24} />
        <h4 className="xl:text-lg text-base font-bold text-secondary-700">User Management</h4>
      </div>

      <div className="flex flex-wrap gap-y-4 -mx-2">
        <div className="sm:w-1/2 w-full px-2">
          <div className="p-4 rounded-lg border border-gray-200 flex flex-wrap gap-3">
            <div>
              <h4 className="font-bold">View Users</h4>
              <span className="text-sm text-gray-500">See user list and information</span>
            </div>
            <label className="inline-flex items-center gap-2 cursor-pointer ml-auto">
              <input type="checkbox" className="sr-only peer" />
              <div className="input-switch"></div>
            </label>
          </div>
        </div>

        <div className="sm:w-1/2 w-full px-2">
          <div className="p-4 rounded-lg border border-gray-200 flex flex-wrap gap-3">
            <div>
              <h4 className="font-bold">Invite Users</h4>
              <span className="text-sm text-gray-500">Send invitations to new users</span>
            </div>
            <label className="inline-flex items-center gap-2 cursor-pointer ml-auto">
              <input type="checkbox" className="sr-only peer" />
              <div className="input-switch"></div>
            </label>
          </div>
        </div>

        <div className="sm:w-1/2 w-full px-2">
          <div className="p-4 rounded-lg border border-gray-200 flex flex-wrap gap-3">
            <div>
              <h4 className="font-bold">Edit Users</h4>
              <span className="text-sm text-gray-500">Modify user roles and information</span>
            </div>
            <label className="inline-flex items-center gap-2 cursor-pointer ml-auto">
              <input type="checkbox" className="sr-only peer" />
              <div className="input-switch"></div>
            </label>
          </div>
        </div>

        <div className="sm:w-1/2 w-full px-2">
          <div className="p-4 rounded-lg border border-gray-200 flex flex-wrap gap-3">
            <div>
              <h4 className="font-bold">Remove Users</h4>
              <span className="text-sm text-gray-500">Delete users from the system</span>
            </div>
            <label className="inline-flex items-center gap-2 cursor-pointer ml-auto">
              <input type="checkbox" className="sr-only peer" />
              <div className="input-switch"></div>
            </label>
          </div>
        </div>
      </div>
    </div>

    <div className="space-y-2">
      <div className="flex gap-1 [&_img]:icon-primary-500">
        <img src="images/icons/bar-chart.svg" alt="Analytics" width={24} />
        <h4 className="xl:text-lg text-base font-bold text-secondary-700">Analytics</h4>
      </div>

      <div className="flex flex-wrap gap-y-4 -mx-2">
        <div className="sm:w-1/2 w-full px-2">
          <div className="p-4 rounded-lg border border-gray-200 flex flex-wrap gap-3">
            <div>
              <h4 className="font-bold">View Analytics</h4>
              <span className="text-sm text-gray-500">Access to usage reports and metrics</span>
            </div>
            <label className="inline-flex items-center gap-2 cursor-pointer ml-auto">
              <input type="checkbox" className="sr-only peer" />
              <div className="input-switch"></div>
            </label>
          </div>
        </div>

        <div className="sm:w-1/2 w-full px-2">
          <div className="p-4 rounded-lg border border-gray-200 flex flex-wrap gap-3">
            <div>
              <h4 className="font-bold">Export Reports</h4>
              <span className="text-sm text-gray-500">Download analytics reports</span>
            </div>
            <label className="inline-flex items-center gap-2 cursor-pointer ml-auto">
              <input type="checkbox" className="sr-only peer" />
              <div className="input-switch"></div>
            </label>
          </div>
        </div>
      </div>
    </div>

    {/* System Settings */}
      <div className="space-y-2">
        <div className="flex gap-1 [&_img]:icon-primary-500">
          <img src="images/icons/gear.svg" alt="System Settings" width={24} />
          <h4 className="xl:text-lg text-base font-bold text-secondary-700">System Settings</h4>
        </div>

        <div className="flex flex-wrap gap-y-4 -mx-2">
          <div className="sm:w-1/2 w-full px-2">
            <div className="p-4 rounded-lg border border-gray-200 flex flex-wrap gap-3">
              <div>
                <h4 className="font-bold">View Settings</h4>
                <span className="text-sm text-gray-500">Access system configuration</span>
              </div>
              <label className="inline-flex items-center gap-2 cursor-pointer ml-auto">
                <input type="checkbox" className="sr-only peer" />
                <div className="input-switch"></div>
              </label>
            </div>
          </div>

          <div className="sm:w-1/2 w-full px-2">
            <div className="p-4 rounded-lg border border-gray-200 flex flex-wrap gap-3">
              <div>
                <h4 className="font-bold">Edit Settings</h4>
                <span className="text-sm text-gray-500">Modify system settings</span>
              </div>
              <label className="inline-flex items-center gap-2 cursor-pointer ml-auto">
                <input type="checkbox" className="sr-only peer" />
                <div className="input-switch"></div>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* AI Chat */}
      <div className="space-y-2">
        <div className="flex gap-1 [&_img]:icon-primary-500">
          <img src="images/icons/ai-power.svg" alt="AI Chat" width={24} />
          <h4 className="xl:text-lg text-base font-bold text-secondary-700">AI Chat</h4>
        </div>

        <div className="flex flex-wrap gap-y-4 -mx-2">
          <div className="sm:w-1/2 w-full px-2">
            <div className="p-4 rounded-lg border border-gray-200 flex flex-wrap gap-3">
              <div>
                <h4 className="font-bold">View Documents</h4>
                <span className="text-sm text-gray-500">Access to view all documents</span>
              </div>
              <label className="inline-flex items-center gap-2 cursor-pointer ml-auto">
                <input type="checkbox" className="sr-only peer" />
                <div className="input-switch"></div>
              </label>
            </div>
          </div>

          <div className="sm:w-1/2 w-full px-2">
            <div className="p-4 rounded-lg border border-gray-200 flex flex-wrap gap-3">
              <div>
                <h4 className="font-bold">View Documents</h4>
                <span className="text-sm text-gray-500">Upload new documents to the system</span>
              </div>
              <label className="inline-flex items-center gap-2 cursor-pointer ml-auto">
                <input type="checkbox" className="sr-only peer" />
                <div className="input-switch"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>


    <div className="space-y-5">
      {/* Header */}
      <div>
        <h3 className="xl:text-xl text-lg font-bold text-secondary-700">Role Settings</h3>
        <p className="text-sm font-medium text-gray-500">
          Additional configuration for this role
        </p>
      </div>

      {/* Form */}
      <div className="space-y-5">
        <div>
          <input
            type="text"
            id="roleName"
            placeholder="Role Name"
            className="form-control"
          />
        </div>

        <div>
          <textarea
            id="description"
            rows={6}
            placeholder="Description"
            className="form-control"
          ></textarea>
        </div>

        <button className="btn btn-secondary">Save</button>
      </div>
    </div>
      </div>
    </div>
  );
}
