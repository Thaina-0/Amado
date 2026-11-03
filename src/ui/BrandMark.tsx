export function BrandMark({ size = 56 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 112 112"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M56 5.25C84 24.5 92.75 61.25 56 106.75C19.25 61.25 28 24.5 56 5.25Z"
        fill="#E4B84D"
      />
      <path
        d="M56 5.25C70 36.75 70 78.75 56 106.75"
        stroke="#331E15"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M56 5.25C42 36.75 42 78.75 56 106.75"
        stroke="#331E15"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  )
}
