import { IconProps } from "./types";

export function NoAvatarSquare({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M6.75 19s1.038-2.7 4.25-3.178l.246-.025m-1.42-6.379a2.251 2.251 0 1 1 2.74 2.76M4.75 9.75v6.5a3 3 0 0 0 3 3h7.5M4.75 4.75h11.5a3 3 0 0 1 3 3v11.5L4.75 4.75Z"
      />
    </svg>
  );
}
