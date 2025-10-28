"use client";

const providers = [
  {
    name: "OpenAI",
    description: "GPT-4o, GPT-4",
    image: "/images/icons/chatgpt.png",
    calls: 18432,
    cost: 98.75,
    progress: 20, // stroke-dashoffset for circle
  },
  {
    name: "Google Gemini",
    description: "User authentication and management",
    image: "/images/icons/gemini.png",
    calls: 18432,
    cost: 92.25,
    progress: 25,
  },
];

const models = [
  { name: "GPT-4o", calls: 12456, cost: 67.8 },
  { name: "GPT-4", calls: 5976, cost: 30.95 },
  { name: "Gemini Pro", calls: 4234, cost: 28.9 },
  { name: "Gemini Flash", calls: 1901, cost: 14.85 },
];

export default function UsageDetails() {
  return (
    <div className="space-y-5">
      {/* Usage by Provider */}
      <div className="space-y-4">
        <div>
          <h3 className="xl:text-xl text-lg font-bold text-secondary-700">
            Usage by Provider
          </h3>
          <p className="text-sm font-medium text-gray-500">
            Current month breakdown by AI service
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex flex-wrap gap-y-4 -mx-2">
            {providers.map((provider) => (
              <div key={provider.name} className="w-full px-2">
                <div className="p-4 rounded-lg border border-gray-200 flex flex-wrap justify-between items-center gap-3">
                  <div className="flex gap-2">
                    <div className="size-12 flex-none flex justify-center items-center rounded-lg bg-gray-100">
                      <img
                        src={provider.image}
                        alt={provider.name}
                        width="30"
                      />
                    </div>
                    <div>
                      <h4 className="font-bold">{provider.name}</h4>
                      <span className="text-sm font-medium text-gray-500">
                        {provider.description}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center gap-4">
                    <div className="text-right">
                      <p className="text-xl font-bold">${provider.cost}</p>
                      <p className="text-gray-500 text-sm">
                        {provider.calls.toLocaleString()} calls
                      </p>
                    </div>

                    <div className="relative size-12">
                      <svg
                        className="w-full h-full transform -rotate-90"
                        viewBox="0 0 40 40"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle
                          className="text-gray-200"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                          cx="20"
                          cy="20"
                          r="16"
                        ></circle>

                        <circle
                          className="text-blue-500"
                          stroke="currentColor"
                          strokeWidth="5"
                          strokeLinecap="round"
                          fill="none"
                          cx="20"
                          cy="20"
                          r="16"
                          strokeDasharray="100"
                          strokeDashoffset={provider.progress}
                        ></circle>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Usage by Model */}
      <div className="space-y-4">
        <div>
          <h3 className="xl:text-xl text-lg font-bold text-secondary-700">
            Usage by Model
          </h3>
          <p className="text-sm font-medium text-gray-500">
            Detailed breakdown by AI model
          </p>
        </div>

        <div className="flex flex-wrap divide-y divide-gray-200">
          {models.map((model) => (
            <div key={model.name} className="w-full">
              <div className="py-4 flex flex-wrap justify-between items-center gap-3">
                <div className="flex gap-2">
                  <div>
                    <h4 className="font-bold">
                      {model.name}{" "}
                      <span className="px-3 py-1 text-xs font-semibold text-gray-400 rounded-full border border-gray-200 bg-gray-50 text-nowrap">
                        {model.calls.toLocaleString()} calls
                      </span>
                    </h4>
                  </div>
                </div>

                <div className="inline-flex gap-1">
                  <p className="text-xl font-bold">${model.cost}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
