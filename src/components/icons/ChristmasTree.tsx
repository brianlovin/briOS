import { IconProps } from "./types";

export function ChristmasTree({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M14.8017 11.25H17.25L12 4.75L6.75 11.25H9.19828L5.75 15.25H8.75L4.75 19.25H19.25L15.25 15.25H18.25L14.8017 11.25Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
