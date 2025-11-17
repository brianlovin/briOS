import { IconProps } from "./types";

export function MoneyBag({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M10 8s.5.25 2 .25S14 8 14 8s1.75-2.25 4-2.25M4.75 15c0 3 3.25 4.25 7.25 4.25S19.25 18 19.25 15c0-1.565-1.7-4.13-3.328-5.27-1.6-1.12-2.497-3.112-1.922-4.98h-4c.575 1.868-.321 3.86-1.922 4.981C6.45 10.871 4.75 13.435 4.75 15Z"
      />
    </svg>
  );
}
