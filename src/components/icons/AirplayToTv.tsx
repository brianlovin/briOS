import { IconProps } from "./types";

export function AirplayToTv({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M16.75 17.25H17.25C18.3546 17.25 19.25 16.3546 19.25 15.25V6.75C19.25 5.64543 18.3546 4.75 17.25 4.75H6.75C5.64543 4.75 4.75 5.64543 4.75 6.75V15.25C4.75 16.3546 5.64543 17.25 6.75 17.25H7.25"
      />
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M12 15.75L9 19.25H15L12 15.75Z"
      />
    </svg>
  );
}
