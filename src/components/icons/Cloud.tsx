import { IconProps } from "./types";

export function Cloud({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M4.75 14C4.75 15.7949 6.20507 17.25 8 17.25H16C17.7949 17.25 19.25 15.7949 19.25 14C19.25 12.2869 17.9246 10.8834 16.2433 10.759C16.1183 8.5239 14.2663 6.75 12 6.75C9.73368 6.75 7.88168 8.5239 7.75672 10.759C6.07542 10.8834 4.75 12.2869 4.75 14Z"
      />
    </svg>
  );
}
