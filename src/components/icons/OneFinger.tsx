import { IconProps } from "./types";

export function OneFinger({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M11.25 11.25V6C11.25 5.30964 10.6904 4.75 10 4.75C9.30964 4.75 8.75 5.30964 8.75 6V13.25L7.14625 11.3273C6.53435 10.5937 5.42107 10.5538 4.75814 11.2416C4.75319 11.2467 4.75173 11.2543 4.75441 11.2609L6.73327 16.1319C7.49909 18.017 9.33087 19.25 11.3656 19.25H15.25C17.4591 19.25 19.25 17.4591 19.25 15.25V14.25C19.25 12.5931 17.9069 11.25 16.25 11.25H11.25Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
