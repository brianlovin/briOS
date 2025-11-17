import { IconProps } from "./types";

export function Needle({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="m16.25 7.75-.5.5H9.115a4 4 0 0 1-3.43-1.942L4.75 4.75m12 10v.023a5 5 0 0 0 1.655 3.717l.845.76m-.63-13.87C22.808 9.568 4.75 19.25 4.75 19.25S14.432 1.193 18.62 5.38Z"
      />
    </svg>
  );
}
