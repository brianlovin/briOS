import { IconProps } from "./types";

export function NoBugs({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M12 19.25v-3.5m0 3.5a4.25 4.25 0 0 1-4.249-4.157M12 19.25a4.252 4.252 0 0 0 4.105-3.145M4.75 8.75v.326a2 2 0 0 0 1.065 1.768l2.069 1.095M19.25 7.75v1.326a2 2 0 0 1-1.065 1.768l-2.069 1.095a4.258 4.258 0 0 0-1.866-2.545m-9.5 9.856v-1.645a2 2 0 0 1 1.298-1.873l1.703-.639m6.499-5.7V7.25m0 2.144a4.226 4.226 0 0 0-2-.637m2-1.507v-.5a2 2 0 0 0-2-2h-.5A2 2 0 0 0 10 5.781m4.25 1.469.894-.447a2 2 0 0 0 1.106-1.79V4.75M7.751 15.093 7.75 15v-2c0-.367.046-.722.134-1.062m0 0A4.255 4.255 0 0 1 9.5 9.563M4.75 4.75l11.355 11.355m3.145 3.145-3.145-3.145"
      />
    </svg>
  );
}
