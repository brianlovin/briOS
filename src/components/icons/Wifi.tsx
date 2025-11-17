import { IconProps } from "./types";

export function Wifi({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <circle cx="12" cy="18" r="1" fill="currentColor" />
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M9.5 14.5627C10.2016 14.0516 11.0656 13.75 12 13.75C12.9344 13.75 13.7984 14.0516 14.5 14.5627"
      />
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M16.7128 11.2276C15.3768 10.2962 13.7523 9.75 12.0002 9.75C10.2481 9.75 8.62358 10.2962 7.2876 11.2276"
      />
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M5 7.94571C6.98421 6.56168 9.39732 5.75 12 5.75C14.6027 5.75 17.0158 6.56168 19 7.94571"
      />
    </svg>
  );
}
