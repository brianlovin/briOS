import { IconProps } from "./types";

export function InputCross({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M19.25 10.25v-1.5a2 2 0 0 0-2-2H6.75a2 2 0 0 0-2 2v4.5a2 2 0 0 0 2 2h5.5m3.5-1.5 1.75 1.75m0 0 1.75 1.75M17.5 15.5l1.75-1.75M17.5 15.5l-1.75 1.75"
      />
    </svg>
  );
}
