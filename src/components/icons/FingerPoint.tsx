import { IconProps } from "./types";

export function FingerPoint({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M15 12.25H18C18.6904 12.25 19.25 11.6904 19.25 11C19.25 10.3097 18.6904 9.75001 18 9.75001H12.25V6.897C12.25 6.02647 11.7582 5.23065 10.9795 4.84133C10.4428 4.57295 9.79526 4.99931 9.77107 5.59894C9.70508 7.23477 9.27444 9.75001 7.25 9.75001L7.25 17.5747C7.25 18.0704 7.61312 18.4913 8.10345 18.5639L12.004 19.1418C13.1035 19.3047 14.1249 18.5399 14.2781 17.439L15 12.25ZM15 12.25H13.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.75 9.75C4.75 9.19772 5.19772 8.75 5.75 8.75H6.25C6.80228 8.75 7.25 9.19772 7.25 9.75V18.25C7.25 18.8023 6.80228 19.25 6.25 19.25H5.75C5.19772 19.25 4.75 18.8023 4.75 18.25V9.75Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
