import { IconProps } from "./types";

export function Back({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M4.75 12L11.25 5.75V9.75H18.25C18.8023 9.75 19.25 10.1977 19.25 10.75V13.25C19.25 13.8023 18.8023 14.25 18.25 14.25H11.25V18.25L4.75 12Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
