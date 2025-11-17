import { IconProps } from "./types";

export function Forward({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M19.25 12L12.75 5.75V9.75H5.75C5.19771 9.75 4.75 10.1977 4.75 10.75V13.25C4.75 13.8023 5.19771 14.25 5.75 14.25H12.75V18.25L19.25 12Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
