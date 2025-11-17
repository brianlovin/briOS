import { IconProps } from "./types";

export function PrivateWifi({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M9.75 13.25c.631-.629 1.409-1 2.25-1m-5.25-2A9.776 9.776 0 0 1 12 8.75c1.05 0 2.06.16 3 .456M4.75 7.25c2.055-1.576 4.554-2.5 7.25-2.5 2.696 0 5.195.924 7.25 2.5m-5.5 7.5v3.5a1 1 0 0 0 1 1h3.5a1 1 0 0 0 1-1v-3.5h-5.5ZM15 14.5v-1.071c0-.79.672-1.429 1.5-1.429s1.5.64 1.5 1.429V14.5"
      />
    </svg>
  );
}
