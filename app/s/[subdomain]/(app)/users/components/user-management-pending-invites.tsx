import Image from "next/image";


export default function PendingInvitesTab() {
    const invites = [
    {
      email: "sarah.johnson@company.com",
      invited: "2 days ago",
      avatar: "/images/avatar.jpg",
    },
    {
      email: "mike.chen@company.com",
      invited: "5 days ago",
      avatar: "/images/avatar.jpg",
    },
    {
      email: "lisa.rodriguez@company.com",
      invited: "1 week ago",
      avatar: "/images/avatar.jpg",
    },
  ];

  return (
    <div className="tab-content">
        <div className="space-y-5">
      {/* Header */}
      <div>
        <h3 className="xl:text-xl text-lg font-bold text-secondary-700">
          Pending Invitations
        </h3>
        <p className="text-sm font-medium text-gray-500">
          Users who have been invited but haven't activated their accounts yet
        </p>
      </div>

      {/* Invite List */}
      <ul className="space-y-3">
        {invites.map((invite, index) => (
          <li
            key={index}
            className="flex justify-between items-center gap-4 p-4 rounded-lg bg-gray-50"
          >
            <div className="flex items-center gap-2">
              <div className="size-12 rounded-full overflow-hidden flex justify-center items-center [&_img]:size-full [&_img]:object-cover">
                <img src={invite.avatar} alt="" />
              </div>
              <div className="flex flex-col">
                <span className="font-semibold">{invite.email}</span>
                <span className="text-xs font-medium text-gray-500">
                  Invited {invite.invited}
                </span>
              </div>
            </div>

            <div className="inline-flex gap-1">
              <button type="button" className="btn btn-secondary btn-sm">
                Resend
              </button>
              <button type="button" className="btn btn-secondary-light btn-sm">
                Cancel
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
    </div>
    
  );
}
