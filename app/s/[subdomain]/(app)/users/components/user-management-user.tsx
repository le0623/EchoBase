import Image from "next/image";

const users = [
  {
    name: "Sarah Johnson",
    email: "demoemailaddress@gmail.com",
    role: "Admin",
    status: "Active",
    lastActive: "2 min ago",
    joined: "15th Jan, 2024",
    avatar: "/images/avatar.jpg",
  },
  {
    name: "John Doe",
    email: "john@example.com",
    role: "Editor",
    status: "Active",
    lastActive: "10 min ago",
    joined: "10th Jan, 2024",
    avatar: "/images/avatar.jpg",
  },
];

export default function UsersTab() {
  return (
    <div className="overflow-x-auto">
      <table className="table table-row-hover w-full">
        <thead className="border-b border-gray-200">
          <tr>
            <th>User</th>
            <th>Role</th>
            <th>Status</th>
            <th>Last Active</th>
            <th>Joined</th>
            <th className="text-center">Action</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200">
          {users.map((user, i) => (
            <tr key={i}>
              <td className="text-nowrap">
                <div className="flex items-center gap-2">
                  <div className="size-8 rounded-full overflow-hidden flex justify-center items-center">
                    <Image
                      src={user.avatar}
                      alt={user.name}
                      width={32}
                      height={32}
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold">{user.name}</span>
                    <span className="text-xs text-gray-500">{user.email}</span>
                  </div>
                </div>
              </td>

              <td className="text-nowrap">
                <span className="px-3 py-0.5 text-xs font-semibold rounded-full border border-gray-200 bg-gray-50">
                  {user.role}
                </span>
              </td>

              <td>
                <span className="px-3 py-1 inline-block text-xs font-semibold text-white rounded-full bg-emerald-500">
                  {user.status}
                </span>
              </td>

              <td>{user.lastActive}</td>

              <td className="text-nowrap font-medium">{user.joined}</td>

              <td>
                <div className="flex justify-center items-center gap-1">
                  <button className="btn btn-primary-light !size-8 !p-0 !rounded-full !flex justify-center items-center">
                    <Image src="/images/icons/eye.svg" alt="View" width={16} height={16} />
                  </button>
                  <button className="btn btn-success-light !size-8 !p-0 !rounded-full !flex justify-center items-center">
                    <Image src="/images/icons/check.svg" alt="Approve" width={12} height={12} />
                  </button>
                  <button className="btn btn-danger-light !size-8 !p-0 !rounded-full !flex justify-center items-center">
                    <Image src="/images/icons/close.svg" alt="Remove" width={16} height={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
