import { IconProps } from "./types";

export function AirTrafficControl({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M12 6.75v-2m0 2H8.75m3.25 0h3.25m-6.5 6.5H6.639a1 1 0 0 1-.988-.843L4.75 6.75h4m0 6.5v6m0-6h.5m6 0h2.111a1 1 0 0 0 .988-.843l.901-5.657h-4m0 6.5v6m0-6h-.5m-5.5 0-.5-6.5m.5 6.5h5.5m0 0 .5-6.5"
      />
    </svg>
  );
}
