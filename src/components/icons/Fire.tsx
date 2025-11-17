import { IconProps } from "./types";

export function Fire({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M18.2499 14C18.2499 18 15.5 19.25 11.9999 19.25C8 19.25 5.75 16.4 5.75 14C5.75 11.6 7 9.41667 8 8.75C8 11.55 10.6666 13.3333 11.9999 13.25C9.59994 9.65 11.6666 5.66667 12.9999 4.75C12.9999 9.25 18.2499 10 18.2499 14Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
