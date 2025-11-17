import { IconProps } from "./types";

export function CardHolder({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M4.75 9.75H9.25V10.25C9.25 11.3546 10.1454 12.25 11.25 12.25H12.75C13.8546 12.25 14.75 11.3546 14.75 10.25V9.75H19.25M6.75 18.25H17.25C18.3546 18.25 19.25 17.3546 19.25 16.25V7.75C19.25 6.64543 18.3546 5.75 17.25 5.75H6.75C5.64543 5.75 4.75 6.64543 4.75 7.75V16.25C4.75 17.3546 5.64543 18.25 6.75 18.25Z"
        stroke="#141414"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
