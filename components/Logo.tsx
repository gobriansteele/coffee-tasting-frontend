export default function Logo({
  className = 'w-10 h-10',
}: {
  className?: string
}) {
  return (
    <svg
      width="200"
      height="200"
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M100 180L30.718 140V60L100 20L169.282 60V140L100 180ZM100 180"
        fill="#2C3E50"
      />
      <path
        d="M100 160C90 140 85 130 85 100C85 70 100 60 115 40"
        stroke="#FFFFFF"
        strokeWidth="12"
        strokeLinecap="round"
      />
      <circle cx="115" cy="40" r="10" fill="#E67E22" />
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
    </svg>
  )
}
