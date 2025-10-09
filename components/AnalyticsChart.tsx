'use client';

interface AnalyticsChartProps {
  data: Array<{ month: string; value: number }>;
}

export default function AnalyticsChart({ data }: AnalyticsChartProps) {
  const maxValue = Math.max(...data.map(d => d.value));
  
  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between h-64 gap-4">
        {data.map((item, index) => {
          const height = (item.value / maxValue) * 100;
          const colors = ['#9ed8ff', '#0198ff', '#9ed8ff', '#0198ff', '#9ed8ff'];
          
          return (
            <div key={item.month} className="flex-1 flex flex-col items-center gap-2">
              <div
                className="w-full rounded-t-lg transition-all"
                style={{
                  height: `${height}%`,
                  backgroundColor: colors[index % colors.length]
                }}
              />
              <span className="text-base font-medium text-[#676767]">{item.month}</span>
            </div>
          );
        })}
      </div>
      <div className="flex justify-between text-base font-medium text-[#676767]">
        <span>0</span>
        <span>100</span>
        <span>500</span>
        <span>1000</span>
      </div>
    </div>
  );
}