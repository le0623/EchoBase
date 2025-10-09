'use client';

import { useState } from 'react';
import ChevronDownSmallIcon from './icons/ChevronDownSmallIcon';

interface ChartDataPoint {
  month: string;
  value: number;
}

interface AnalyticsChartCardProps {
  data: ChartDataPoint[];
}

export default function AnalyticsChartCard({ data }: AnalyticsChartCardProps) {
  const [selectedFilter, setSelectedFilter] = useState('Membership');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const maxValue = 1000;
  const yAxisLabels = [1000, 500, 100, 0];

  return (
    <div className="bg-white rounded-[20px] border border-[var(--border-light)] p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-extrabold text-[#1d1d1d]">Analytics</h2>
        
        {/* Filter Dropdown */}
        <div className="dropdown dropdown-end">
          <button
            className="btn btn-sm bg-white border border-[var(--border-light)] rounded-xl flex items-center gap-2 hover:bg-base-200"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <span className="text-sm font-bold tracking-[-0.11px] text-[#1d1d1d]">
              {selectedFilter}
            </span>
            <ChevronDownSmallIcon width={13} height={7} />
          </button>
          {isDropdownOpen && (
            <ul className="dropdown-content menu bg-white rounded-box z-[1] w-40 p-2 shadow-lg border border-[var(--border-light)] mt-2">
              <li><a onClick={() => { setSelectedFilter('Membership'); setIsDropdownOpen(false); }}>Membership</a></li>
              <li><a onClick={() => { setSelectedFilter('Revenue'); setIsDropdownOpen(false); }}>Revenue</a></li>
              <li><a onClick={() => { setSelectedFilter('Users'); setIsDropdownOpen(false); }}>Users</a></li>
            </ul>
          )}
        </div>
      </div>

      {/* Chart */}
      <div className="flex gap-6">
        {/* Y-axis Labels */}
        <div className="flex flex-col justify-between h-[267px] text-right">
          {yAxisLabels.map((label) => (
            <span key={label} className="text-base font-medium text-[#676767]">
              {label}
            </span>
          ))}
        </div>

        {/* Bars */}
        <div className="flex-1">
          <div className="flex items-end justify-between h-[267px] gap-4">
            {data.map((item, index) => {
              const height = (item.value / maxValue) * 100;
              const colors = ['#9ed8ff', '#0198ff', '#9ed8ff', '#0198ff', '#9ed8ff'];
              
              return (
                <div key={item.month} className="flex-1 flex flex-col items-center gap-3">
                  <div
                    className="w-full rounded-t-xl transition-all hover:opacity-80"
                    style={{
                      height: `${height}%`,
                      backgroundColor: colors[index % colors.length]
                    }}
                  />
                  <span className="text-base font-medium text-[#676767]">
                    {item.month}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}