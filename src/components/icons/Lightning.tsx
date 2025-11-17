import { IconProps } from "./types";

export function Lightning({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M7.25 15.25C6 15.25 4.75 13.7949 4.75 12C4.75 10.2869 6.07542 8.88339 7.75672 8.75897C7.88168 6.5239 9.73368 4.75 12 4.75C14.2663 4.75 16.1183 6.5239 16.2433 8.75897C17.9246 8.88339 19.25 10.2869 19.25 12C19.25 13.7949 18 15.25 16.75 15.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.25 12.75L10.75 16.25H13.25L11.75 19.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
