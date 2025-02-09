type Properties = {
  className?: string;
};

export const SoundDisabled = ({ className }: Properties) => {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M22 9L16 15M16 9L22 15M11 5L6 9H2V15H6L11 19V5Z"
        stroke="#757575"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
