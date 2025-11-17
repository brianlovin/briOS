import { IconProps } from "./types";

export function Closet({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M12 4.75H5.75a1 1 0 0 0-1 1v13.5H12m0-14.5h6.25a1 1 0 0 1 1 1v13.5H12m0-14.5v14.5m3.25-6.5h-.5m-5.5 0h-.5"
      />
    </svg>
  );
}
