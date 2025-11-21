export default function WidgetIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <line x1="9" y1="3" x2="9" y2="21" />
      <line x1="3" y1="9" x2="21" y2="9" />
      <circle cx="6" cy="6" r="1" />
      <circle cx="18" cy="6" r="1" />
      <circle cx="6" cy="18" r="1" />
      <circle cx="18" cy="18" r="1" />
    </svg>
  );
}

