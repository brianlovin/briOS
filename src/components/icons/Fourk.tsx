import { IconProps } from "./types";

export function Fourk({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M7.75 9.75v2a1 1 0 0 0 1 1h1.5m0 0v-3m0 3v1.5m3.5-4.5V12m0 0v2.25m0-2.25H15m0 0 1.25-2.25M15 12l1.25 2.25m-9.5 4h10.5a2 2 0 0 0 2-2v-8.5a2 2 0 0 0-2-2H6.75a2 2 0 0 0-2 2v8.5a2 2 0 0 0 2 2Z"
      />
    </svg>
  );
}
