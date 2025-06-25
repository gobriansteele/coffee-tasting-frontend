export default function Logo({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Background circle */}
      <circle cx="100" cy="100" r="95" fill="#1D1D1F"/>
      
      {/* Coffee cup silhouette */}
      <path d="M65 70 L65 130 Q65 145 80 145 L120 145 Q135 145 135 130 L135 70 Z" fill="#F5F5F7" stroke="none"/>
      
      {/* Cup handle */}
      <path d="M135 90 Q155 90 155 110 Q155 130 135 130" fill="none" stroke="#F5F5F7" strokeWidth="8" strokeLinecap="round"/>
      
      {/* Refined steam */}
      <path d="M85 60 Q87 52 85 45" fill="none" stroke="#F5F5F7" strokeWidth="2" strokeLinecap="round" opacity="0.8"/>
      <path d="M100 60 Q98 52 100 45" fill="none" stroke="#F5F5F7" strokeWidth="2" strokeLinecap="round" opacity="0.6"/>
      <path d="M115 60 Q113 52 115 45" fill="none" stroke="#F5F5F7" strokeWidth="2" strokeLinecap="round" opacity="0.8"/>
    </svg>
  );
}