import { IconProps } from "./types";

export function ToggleLeft({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M10 17.25H14C16.8995 17.25 19.25 14.8995 19.25 12C19.25 9.10051 16.8995 6.75 14 6.75H10C7.1005 6.75 4.75 9.10051 4.75 12C4.75 14.8995 7.1005 17.25 10 17.25Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.25 12C12.25 13.2426 11.2426 14.25 10 14.25C8.75736 14.25 7.75 13.2426 7.75 12C7.75 10.7574 8.75736 9.75 10 9.75C11.2426 9.75 12.25 10.7574 12.25 12Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
