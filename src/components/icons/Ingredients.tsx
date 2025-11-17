import { IconProps } from "./types";

export function Ingredients({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M16 8.25v.01m3.25-2.01v.01m-6.5-.01v.01M16 4.75v.01M4.75 11.75s0 4.372 4 5.945v1.555h6.5v-1.555c4-1.573 4-5.945 4-5.945H4.75Z"
      />
    </svg>
  );
}
