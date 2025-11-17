import { IconProps } from "./types";

export function Shield({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M12 4.75L4.75001 8C4.75001 8 4.00001 19.25 12 19.25C20 19.25 19.25 8 19.25 8L12 4.75Z"
      />
    </svg>
  );
}
