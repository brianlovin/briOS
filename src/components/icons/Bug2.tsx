import { IconProps } from "./types";

export function Bug2({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M12 19.25v-3.5m0 3.5a4.25 4.25 0 0 1-4.249-4.157M12 19.25a4.25 4.25 0 0 0 4.249-4.157M4.75 7.75v1.326a2 2 0 0 0 1.065 1.768l2.069 1.095M19.25 7.75v1.326a2 2 0 0 1-1.065 1.768l-2.069 1.095M4.75 19.25v-1.645a2 2 0 0 1 1.298-1.873l1.703-.639M19.25 19.25v-1.645a2 2 0 0 0-1.298-1.873l-1.703-.639M9.75 7.25v-.5a2 2 0 0 1 2-2h.5a2 2 0 0 1 2 2v.5m-4.5 0v2m0-2-.894-.447a2 2 0 0 1-1.106-1.79V4.75m6.5 4.5v-2m0 0 .894-.447a2 2 0 0 0 1.106-1.79V4.75M7.751 15.093 7.75 15v-2c0-.367.046-.722.134-1.062m0 0a4.252 4.252 0 0 1 8.232 0m0 0c.088.34.134.695.134 1.062v2l-.001.093"
      />
    </svg>
  );
}
