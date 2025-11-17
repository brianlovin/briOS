import { IconProps } from "./types";

export function InsertRow({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M12 13.75v4.5M14.25 16h-4.5m-5-6.75v-2.5a1 1 0 0 1 1-1h12.5a1 1 0 0 1 1 1v2.5a1 1 0 0 1-1 1H5.75a1 1 0 0 1-1-1Z"
      />
    </svg>
  );
}
