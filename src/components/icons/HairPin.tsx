import { IconProps } from "./types";

export function HairPin({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M16.25 4.75 5.397 15.48a2.208 2.208 0 0 0 3.123 3.123l1.73-1.526V14.25h3l1-1.29v-2.21h1.97l3.03-3"
      />
    </svg>
  );
}
