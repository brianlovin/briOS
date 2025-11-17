import { IconProps } from "./types";

export function Volcano({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M18.5911 10.591C19.4698 9.71236 19.4698 8.28774 18.5911 7.40906C17.7124 6.53038 16.1286 6.37132 15.2499 7.25C15.148 6.59182 14.8052 6.20894 14.2981 5.7019C13.0289 4.4327 10.9711 4.4327 9.70194 5.7019C9.19491 6.20894 8.85185 6.59182 8.74993 7.25C7.87125 6.37132 6.28745 6.52987 5.40877 7.40855C4.53009 8.28723 4.53009 9.71185 5.40877 10.5905"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.7502 10.25V9.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.2522 10.25V9.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.75024 19.25C4.75024 19.25 8.75024 19.25 10.7502 12.75H13.2502C15.2502 19.25 19.2502 19.25 19.2502 19.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
