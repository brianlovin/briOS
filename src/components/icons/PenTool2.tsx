import { IconProps } from "./types";

export function PenTool2({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M6.75 18.25L6.75 17.75C6.75 17.1977 7.19771 16.75 7.75 16.75L16.25 16.75C16.8023 16.75 17.25 17.1977 17.25 17.75V18.25C17.25 18.8023 16.8023 19.25 16.25 19.25L7.75 19.25C7.19772 19.25 6.75 18.8023 6.75 18.25Z"
        stroke="#currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.75011 16.6562L6.96388 12.2744C6.83126 11.9491 6.8791 11.578 7.0899 11.2969L11.2001 5.81666C11.6001 5.28332 12.4001 5.28332 12.8001 5.81666L16.9103 11.2969C17.1211 11.578 17.169 11.9491 17.0363 12.2744L15.2501 16.6562"
        stroke="#currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 5L12 12.25"
        stroke="#currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
