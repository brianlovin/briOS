import { IconProps } from "./types";

export function Planet({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 25 24" {...rest} fill="none">
      <path
        d="M17.45 12C17.45 14.8995 15.0994 17.25 12.2 17.25C9.30046 17.25 6.94995 14.8995 6.94995 12C6.94995 9.10051 9.30046 6.75 12.2 6.75C15.0994 6.75 17.45 9.10051 17.45 12Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.7 13C14.7 13.2761 14.4761 13.5 14.2 13.5C13.9238 13.5 13.7 13.2761 13.7 13C13.7 12.7239 13.9238 12.5 14.2 12.5C14.4761 12.5 14.7 12.7239 14.7 13Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.94031 7.02836C7.63854 5.28601 5.78831 4.43988 5.21547 5.01271C4.33767 5.89052 6.79189 9.76794 10.6971 13.6732C14.6024 17.5784 18.4798 20.0327 19.3576 19.1549C19.9442 18.5682 19.0427 16.6419 17.2145 14.2629"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
