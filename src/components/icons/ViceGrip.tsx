import { IconProps } from "./types";

export function ViceGrip({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M16.75 9.75h1.5m-1.5 2.5h1.5m1-5h-10v1h-4.5v-1.5a2 2 0 0 1 2-2h12.5v2.5Zm0 7.5h-10v-1h-4.5v1.5a2 2 0 0 0 2 2h7v2h3.5v-2h2v-2.5Z"
      />
    </svg>
  );
}
