import { IconProps } from "./types";

export function HandMinus({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentCollor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M7.25 14v-1.25h-2.5v6.5h2.5m0-5.25v5.25m0-5.25 2.762-1.615a4 4 0 0 1 2.163-.635h1.075v1m-6 6.5c6.5 0 12-4.5 12-4.5v-2h-6m0 0V14l-2.5 1.25M19.25 7h-4.5"
      />
    </svg>
  );
}
