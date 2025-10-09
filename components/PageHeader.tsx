import Image from 'next/image';

interface PageHeaderProps {
  title: string;
  description: string;
  illustration?: string;
  actionButton?: {
    label: string;
    onClick: () => void;
  };
}

export default function PageHeader({ title, description, illustration, actionButton }: PageHeaderProps) {
  return (
    <div className="relative bg-gradient-to-r from-[#f5f5f5] to-[#e8e8f8] rounded-xl p-12 mb-8 overflow-hidden">
      <div className="relative z-10 max-w-xl">
        <h1 className="heading-xl mb-4">{title}</h1>
        <p className="body-lg text-[#676767] mb-6">{description}</p>
        {actionButton && (
          <button
            onClick={actionButton.onClick}
            className="bg-[#1d1d1d] text-white px-6 py-3 rounded-xl font-bold text-base tracking-[-0.13px] flex items-center gap-2"
          >
            <svg width="11" height="11" viewBox="0 0 11 11" fill="currentColor">
              <path d="M5.5 0V11M0 5.5H11" stroke="currentColor" strokeWidth="2" />
            </svg>
            {actionButton.label}
          </button>
        )}
      </div>
      {illustration && (
        <Image
          src={illustration}
          alt=""
          width={400}
          height={300}
          className="absolute right-0 top-1/2 -translate-y-1/2"
        />
      )}
    </div>
  );
}