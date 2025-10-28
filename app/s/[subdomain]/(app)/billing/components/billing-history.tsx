"use client";

type PaymentStatus = "Paid" | "Pending" | "Failed" | "Processing";

interface Invoice {
  name: string;
  paid: PaymentStatus;
  date: string;
  cost: number;
}

const invoices: Invoice[] = [
  { name: "Invoice #INV-2024-001", paid: "Paid", date: "March 2024", cost: 127.45 },
  { name: "Invoice #INV-2024-002", paid: "Pending", date: "April 2024", cost: 80.95 },
  { name: "Invoice #INV-2024-003", paid: "Failed", date: "May 2024", cost: 48.9 },
  { name: "Invoice #INV-2024-004", paid: "Processing", date: "June 2024", cost: 60.0 },
];

// ✅ Helper: return Tailwind color classes + icon path
const getPaymentStyle = (status: PaymentStatus) => {
  switch (status) {
    case "Paid":
      return {
        color: "bg-green-500 border-green-600 text-white [&_img]:icon-white",
        icon: "/images/icons/check-circle.svg",
      };
    case "Pending":
      return {
        color: "bg-yellow-400 border-yellow-500 text-white [&_img]:icon-white",
        icon: "/images/icons/clock.svg",
      };
    case "Failed":
      return {
        color: "bg-red-500 border-red-600 text-white [&_img]:icon-white",
        icon: "/images/icons/close.svg",
      };
    case "Processing":
      return {
        color: "bg-blue-500 border-blue-600 text-white [&_img]:icon-white",
        icon: "/images/icons/clock.svg",
      };
    default:
      return {
        color: "bg-gray-400 border-gray-400 text-white [&_img]:icon-white",
        icon: "/images/icons/processing.svg",
      };
  }
};

export default function BillingHistory() {
  return (
    <div className="space-y-5">

      {/* Usage by Model */}
      <div className="space-y-4">
        <div>
          <h3 className="xl:text-xl text-lg font-bold text-secondary-700">
            Payment History
          </h3>
          <p className="text-sm font-medium text-gray-500">
            Recent charges and invoices
          </p>
        </div>

        <div className="flex flex-wrap divide-y divide-gray-200">
          {invoices.map((invoice) => {
            const { color, icon } = getPaymentStyle(invoice.paid);
            return (
              <div key={invoice.name} className="w-full">
                <div className="py-4 flex flex-wrap justify-between items-center gap-3">
                  {/* Left side */}
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold">{invoice.name}</h4>
                      <span
                        className={`pl-1 py-1 pr-2 inline-flex items-center gap-1 text-xs font-semibold rounded-full border text-nowrap ${color}`}
                      >
                        <img src={icon} alt={invoice.paid} width={16} height={16} />
                        {invoice.paid}
                      </span>
                    </div>
                    <span className="text-xs font-medium text-gray-400">{invoice.date}</span>
                  </div>

                  {/* Right side */}
                  <div className="inline-flex gap-1">
                    <p className="text-xl font-bold">${invoice.cost.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
