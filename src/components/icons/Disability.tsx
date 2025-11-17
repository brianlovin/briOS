import { IconProps } from "./types";

export function Disability({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentCollor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M10.75 11.75h3.5m-3.5-2.514v6.014h3.5l3 4M7.14 11.141a4.75 4.75 0 0 0 5.534 7.583M13.25 7a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
      />
    </svg>
  );
}
