import { IconProps } from "./types";

export function Disability2({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentCollor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M14.712 17.712A5.25 5.25 0 0 1 6.144 12M13 9l-1.49 3.789a1 1 0 0 0 .887 1.46h3.853l3 5M12.213 11 7 7.75l-2.25 2.5M16.25 7a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
      />
    </svg>
  );
}
