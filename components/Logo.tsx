export default function Logo({
  className = 'w-10 h-10',
}: {
  className?: string
}) {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient
          id="paint0_linear"
          x1="100"
          y1="20"
          x2="100"
          y2="180"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#34495E" />
          <stop offset="1" stopColor="#2C3E50" />
        </linearGradient>
      </defs>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M100 180L30.718 140V60L100 20L169.282 60V140L100 180Z"
        fill="url(#paint0_linear)"
      />
      {/* Outer coffee bean ellipse */}
      <ellipse
        cx="100"
        cy="100"
        rx="45"
        ry="55"
        stroke="#FFFFFF"
        strokeWidth="8"
        fill="none"
      />
      {/* Inner coffee bean seam/crease */}
      <path
        d="M100 155C90 135 85 120 85 100C85 80 100 65 115 45"
        stroke="#FFFFFF"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <circle cx="115" cy="45" r="10" fill="#E67E22" />
    </svg>
  )
}
