import { IconProps } from "./types";

export function SendMoney2({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M19.25 12.25v-3.5a2 2 0 0 0-2-2H6.75a2 2 0 0 0-2 2v6.5a2 2 0 0 0 2 2h12.5m0 0-1.5-1.5m1.5 1.5L17.75 19m-3.5-7c0 1.795-1.007 3.25-2.25 3.25S9.75 13.795 9.75 12 10.757 8.75 12 8.75s2.25 1.455 2.25 3.25Z"
      />
    </svg>
  );
}
