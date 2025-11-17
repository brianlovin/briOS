import { IconProps } from "./types";

export function ToggleRight({ size = 20, ...rest }: IconProps) {
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
        d="M16.25 12C16.25 13.2426 15.2426 14.25 14 14.25C12.7574 14.25 11.75 13.2426 11.75 12C11.75 10.7574 12.7574 9.75 14 9.75C15.2426 9.75 16.25 10.7574 16.25 12Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
