import { IconProps } from "./types";

export function Bottle({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M7.75 19.25v-3.186a8 8 0 0 1 2.343-5.657l.657-.657v-2.5m6.5 12v-3.186a8 8 0 0 0-2.343-5.657l-.657-.657v-2.5m-3.5 0v-2.5h3.5v2.5m-3.5 0h3.5"
      />
    </svg>
  );
}
