import { IconProps } from "./types";

export function Apple2({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M10.75 12.25s0-1.469 1.42-2.61m0 0c.56-.542 1.216-.89 1.985-.89 2.262 0 4.095 2.35 4.095 5.25s-1.833 5.25-4.095 5.25l-.471-.219a4 4 0 0 0-3.368 0l-.471.219C7.583 19.25 5.75 16.9 5.75 14s1.833-5.25 4.095-5.25a3.39 3.39 0 0 1 1.92.611l.405.279Zm3.08-4.89C12 4.75 12 9 12 9v.5"
      />
    </svg>
  );
}
