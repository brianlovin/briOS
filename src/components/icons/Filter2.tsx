import { IconProps } from "./types";

export function Filter2({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M4.75 4.75H19.25C19.25 8.06033 17.2814 11.0233 14.25 11.9507V18.25C14.25 18.8023 13.8023 19.25 13.25 19.25H10.75C10.1977 19.25 9.75 18.8023 9.75 18.25V11.9507C6.7186 11.0233 4.75 8.06033 4.75 4.75Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
