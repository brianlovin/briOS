import { IconProps } from "./types";

export function ShipmentCheck({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="m14.75 17.75 1.5 1.5c.75-2.25 3-3.5 3-3.5m-8 3.5h-4.5a2 2 0 0 1-2-2V9.635a2 2 0 0 1 .366-1.154L7.75 4.75h8.5l2.634 3.731a2 2 0 0 1 .366 1.154v2.615M5 9.25h14M12 5v4"
      />
    </svg>
  );
}
