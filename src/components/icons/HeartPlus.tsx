import { IconProps } from "./types";

export function HeartPlus({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M11 17.328 5.667 12.39c-1.427-1.758-1.171-4.243.645-5.73 1.816-1.486 4.234-1.049 5.683.574 1.45-1.623 3.836-2.044 5.683-.573C19.053 7.754 19.46 9.58 19 11.149m-2 3.601V17m0 0v2.25M17 17h2.25M17 17h-2.25"
      />
    </svg>
  );
}
