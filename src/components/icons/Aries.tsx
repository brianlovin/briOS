import { IconProps } from "./types";

export function Aries({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M5.43246 8.6141C5.01153 8.20524 4.75 7.63316 4.75 7C4.75 5.75736 5.75736 4.75 7 4.75C8.1572 4.75 8.85031 5.9987 9.2467 7.08589C10.2266 9.77358 12 15.1973 12 19.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18.5675 8.6141C18.9885 8.20524 19.25 7.63316 19.25 7C19.25 5.75736 18.2426 4.75 17 4.75C15.8428 4.75 15.1497 5.9987 14.7533 7.08589C13.7734 9.77358 12 15.1973 12 19.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
