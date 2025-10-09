interface StatCardProps {
  label: string;
  value: string | number;
  change: number;
  isPositive?: boolean;
}

export default function StatCard({ label, value, change, isPositive = true }: StatCardProps) {
  const changeColor = isPositive ? 'text-[#33a36a]' : 'text-[#fd3b3b]';
  const bgColor = isPositive ? 'bg-[#33a36a]' : 'bg-[#fd3b3b]';

  return (
    <div className="space-y-1">
      <p className="text-lg font-medium tracking-[-0.14px] text-[#676767]">{label}</p>
      <div className="flex items-center gap-2">
        <span className="text-[2.25rem] font-extrabold tracking-[-0.0675rem]">{value}</span>
        <div className="flex items-center gap-1">
          <div className={`w-3 h-3 ${bgColor} rounded`} />
          <span className={`text-[0.835rem] font-extrabold tracking-[-0.0069rem] ${changeColor}`}>
            {Math.abs(change)}%
          </span>
        </div>
      </div>
    </div>
  );
}