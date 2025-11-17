import { IconProps } from "./types";

export function ShipmentCross({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="m15.75 15.75 1.75 1.75m0 0 1.75 1.75M17.5 17.5l1.75-1.75M17.5 17.5l-1.75 1.75m-3.5 0h-5.5a2 2 0 0 1-2-2V9.635a2 2 0 0 1 .366-1.154L7.75 4.75h8.5l2.634 3.731a2 2 0 0 1 .366 1.154v2.615M5 9.25h14M12 5v4"
      />
    </svg>
  );
}
