import { IconProps } from "./types";

export function Faucet({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="m9.25 6.75-4.5 1v11.5h2.5a2 2 0 0 0 2-2v-4m0-6.5 7-2m-7 2v2m0 0h10v2.5c-5 0-10 2-10 2m0-4.5v4.5m10 4.75a1.25 1.25 0 1 1-2.5 0c0-.69 1.25-2.25 1.25-2.25s1.25 1.56 1.25 2.25Z"
      />
    </svg>
  );
}
