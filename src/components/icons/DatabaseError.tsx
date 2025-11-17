import { IconProps } from "./types";

export function DatabaseError({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M19.25 7C19.25 8.10457 15.866 9.25 12 9.25C8.13401 9.25 4.75 8.10457 4.75 7C4.75 5.89543 8.13401 4.75 12 4.75C15.866 4.75 19.25 5.89543 19.25 7Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19.25 10.25V7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.75 17V7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.25 14.0611C7 14 4.75 12.8339 4.75 12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.25 19.25C7 19.1889 4.75 17.8339 4.75 17"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19.25 16C19.25 17.7949 17.7949 19.25 16 19.25C14.2051 19.25 12.75 17.7949 12.75 16C12.75 14.2051 14.2051 12.75 16 12.75C17.7949 12.75 19.25 14.2051 19.25 16Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14 14L18 18"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
