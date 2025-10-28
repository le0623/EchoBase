"use client"; // if using Next.js 13 app directory

import { useState } from "react";
import UsageDetails from "./components/usage-details";
import BillingHistory from "./components/billing-history";
import CostAlerts from "./components/cost-alerts";

export default function Billing() {
  const [activeTab, setActiveTab] = useState("usage");

  const tabs = [
    { id: "usage", label: "Usage Details" },
    { id: "history", label: "Billing History" },
    { id: "alerts", label: "Cost Alerts" },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "usage":
        return <UsageDetails />;
      case "history":
        return <BillingHistory />;
      case "alerts":
        return <CostAlerts />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col">
      {/* Top Section */}
      <div className="flex flex-wrap gap-y-4 -mx-3">
        <div className="lg:w-3/5 w-full px-3">
          <div className="h-full p-5 lg:pb-0 relative">
            <div className="rounded-xl absolute inset-0 bg-[#e4e4e4] overflow-hidden">
              <div className="w-[27vw] h-[11vw] rounded-[50%] bg-[#0198FF] blur-[100px] absolute top-[10vw] right-[10vw] rotate-[37deg] opacity-80"></div>
              <div className="w-[40vw] h-[18vw] rounded-[50%] bg-[#FEDCB6] blur-[130px] absolute top-[6vw] -right-[15vw] rotate-[50deg]"></div>
              <div className="w-[17vw] h-[11vw] rounded-[50%] bg-[#0198FF] blur-[70px] absolute top-[20vw] -right-[10vw] -rotate-[37deg] opacity-80"></div>
            </div>
            <div className="relative">
              <div className="flex flex-wrap gap-y-5">
                <div className="lg:-mt-9 md:w-1/2 md:order-last text-center">
                  <img
                    src="images/billing-3d.png"
                    alt=""
                    className="max-w-full inline-block"
                  />
                </div>
                <div className="flex flex-col items-start justify-center [&_h1_strong]:text-primary-500 space-y-5 md:w-1/2 md:order-first [&_strong]:text-primary-500">
                  <div>
                    <h2 className="xl:text-4xl lg:text-3xl md:text-2xl text-xl font-extrabold leading-[1.2]">
                      Billing & Usage
                    </h2>
                    <p>Monitor your AI service costs and usage</p>
                  </div>
                  <a
                    href="#"
                    className="btn btn-secondary !inline-flex gap-1 !justify-start"
                  >
                    <img src="images/icons/plus.svg" alt="" /> Add
                    Provider
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="lg:w-2/5 w-full px-3">
          <div className="rounded-xl border light-border bg-white h-full p-4">
            <ul className="flex flex-wrap justify-between items-center sm:[&>*:nth-of-type(2n+1)]:border-r sm:[&>*:not(:nth-last-child(-n+2))]:border-b [&>*]:border-gray-200">
              <li className="sm:w-1/2 w-full px-6 py-5 flex flex-col items-start">
                <span className="text-gray-500 text-sm font-medium">
                  Current Month
                </span>
                <div className="flex items-center gap-2">
                  <span className="xl:text-3xl lg:text-2xl text-xl font-extrabold text-gray-900">
                    $142.50
                  </span>
                  <span className="text-sm text-green-600 font-bold flex [&_img]:icon-theme-green-500">
                    <img
                      src="images/icons/arrow-upward.svg"
                      alt="Up"
                      width="16"
                    />{" "}
                    12%
                  </span>
                </div>
              </li>

              <li className="sm:w-1/2 w-full px-6 py-5 flex flex-col items-start">
                <span className="text-gray-500 text-sm font-medium">
                  API Calls
                </span>
                <div className="flex items-center gap-2">
                  <span className="xl:text-3xl lg:text-2xl text-xl font-extrabold text-gray-900">
                    24,567
                  </span>
                  <span className="text-sm text-green-600 font-bold flex [&_img]:icon-theme-green-500">
                    <img
                      src="images/icons/arrow-upward.svg"
                      alt="Down"
                      width="16"
                    />{" "}
                    75%
                  </span>
                </div>
              </li>

              <li className="sm:w-1/2 w-full px-6 py-5 flex flex-col items-start">
                <span className="text-gray-500 text-sm font-medium">
                  Tokens Used
                </span>
                <div className="flex items-center gap-2">
                  <span className="xl:text-3xl lg:text-2xl text-xl font-extrabold text-gray-900">
                    2.1M
                  </span>
                  <span className="text-sm text-green-600 font-bold flex [&_img]:icon-theme-green-500">
                    <img
                      src="images/icons/arrow-upward.svg"
                      alt="Up"
                      width="16"
                    />{" "}
                    10%
                  </span>
                </div>
              </li>

              <li className="sm:w-1/2 w-full px-6 py-5 flex flex-col items-start">
                <span className="text-gray-500 text-sm font-medium">
                  Est. Month End
                </span>
                <div className="flex items-center gap-2">
                  <span className="xl:text-3xl lg:text-2xl text-xl font-extrabold text-gray-900">
                    $189.30
                  </span>
                  <span className="text-sm text-red-600 font-bold flex [&_img]:icon-red-500">
                    <img
                      src="images/icons/arrow-downward.svg"
                      alt="Up"
                      width="16"
                    />{" "}
                    23%
                  </span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="w-full px-3 mt-4">
          <div className="rounded-xl border light-border bg-white h-full p-4">
            {/* Tabs */}
            <ul className="mb-3 nav nav-tabs flex border-b light-border [&>*]:flex-1 [&>*]:nav-item [&>*]:inline-flex [&>*]:justify-center [&>*]:items-center [&>*]:gap-1">
              {tabs.map((tab) => (
                <li key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`nav-item cursor-pointer ${activeTab === tab.id
                    ? "active"
                    : ""
                    }`}
                >
                  {tab.label}
                </li>
              ))}
            </ul>

            {/* Tab Content */}
            <div>{renderTabContent()}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
