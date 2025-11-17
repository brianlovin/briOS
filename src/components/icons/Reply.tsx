import { IconProps } from "./types";

export function Reply({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M4.75 11L11.25 4.75V9.25C19.25 9.25 19.25 15 19.25 19.25C17 13 11.25 12.75 11.25 12.75V17.25L4.75 11Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
