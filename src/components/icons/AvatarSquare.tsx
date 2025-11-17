import { IconProps } from "./types";

export function AvatarSquare({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M6.75 19S8 15.75 12 15.75 17.25 19 17.25 19m-3-9a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-6.5 9.25h8.5a3 3 0 0 0 3-3v-8.5a3 3 0 0 0-3-3h-8.5a3 3 0 0 0-3 3v8.5a3 3 0 0 0 3 3Z"
      />
    </svg>
  );
}
