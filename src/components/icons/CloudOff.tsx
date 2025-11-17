import { IconProps } from "./types";

export function CloudOff({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M16 17.5C17.7949 17.5 19.25 16.0449 19.25 14.25C19.25 12.5369 17.9246 11.1334 16.2433 11.009C16.1183 8.7739 14.2663 7 12 7C10.9973 7 10.0756 7.34727 9.3488 7.92811M7 11.1567C5.69437 11.5785 4.75 12.804 4.75 14.25C4.75 16.0449 6.20507 17.5 8 17.5H11.25M6.75 5L17.25 19.5"
        stroke="#141414"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
