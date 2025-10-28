"use client";

type StatusType = "active" | "inactive" | "pending" | "rejected";

interface Model {
  name: string;
  statusSmg: string;
  status: StatusType;
}

const models: Model[] = [
  {
    name: "80% Budget Alert",
    statusSmg: "Notify at $160 spending",
    status: "active",
  },
  {
    name: "90% Usage Alert",
    statusSmg: "Notify at 27k API calls",
    status: "pending",
  },
  {
    name: "Daily Spending Alert",
    statusSmg: "Notify at $20 daily spending",
    status: "inactive",
  },
  
];

// ✅ Helper function to get class by status
const getStatusClass = (status: StatusType) => {
  switch (status) {
    case "active":
      return "bg-green-500 border-green-600 text-white";
    case "inactive":
      return "bg-gray-400 border-gray-500 text-white";
    case "pending":
      return "bg-yellow-400 border-yellow-500 text-white";
    case "rejected":
      return "bg-red-500 border-red-600 text-white";
    default:
      return "bg-gray-200 border-gray-300 text-black";
  }
};

export default function CostAlerts() {
  return (
    <div className="space-y-5">

      {/* Usage by Model */}
      <div className="space-y-4">
        <div>
          <h3 className="xl:text-xl text-lg font-bold text-secondary-700">
            Cost Alerts
          </h3>
          <p className="text-sm font-medium text-gray-500">
            Set up notifications for usage and spending limits
          </p>
        </div>

        <div className="flex flex-wrap divide-y divide-gray-200">
          {models.map((m, i) => (
            <div key={m.name} className="w-full">
              <div className="py-4 flex flex-wrap justify-between items-center gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold">{m.name}</h4>
                  </div>
                  <span className="text-xs font-medium text-gray-400">{m.statusSmg}</span>
                </div>

                <div className="inline-flex gap-1">
                  <span
                    className={`px-3 py-1 inline-flex items-center gap-1 text-xs font-semibold rounded-full border text-nowrap ${getStatusClass(
                      m.status
                    )}`}
                  >
                    {m.status.charAt(0).toUpperCase() + m.status.slice(1)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
