import { IconProps } from "./types";

export function Devices({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentCollor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M7.75 8.25v-.5a1 1 0 0 1 1-1h9.5a1 1 0 0 1 1 1v10.5a1 1 0 0 1-1 1h-5.5m-8-1v-6.5a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1v6.5a1 1 0 0 1-1 1h-3.5a1 1 0 0 1-1-1Z"
      />
    </svg>
  );
}
