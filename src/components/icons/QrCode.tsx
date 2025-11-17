import { IconProps } from "./types";

export function QrCode({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M7.25 19.25H6.75C5.64543 19.25 4.75 18.3546 4.75 17.25L4.75 16.75"
        stroke="#currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.75 12.75L8.25 12.75C9.35457 12.75 10.25 13.6454 10.25 14.75L10.25 16.25"
        stroke="#currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18.25 14.75L15.75 14.75C15.1977 14.75 14.75 15.1977 14.75 15.75L14.75 18.25C14.75 18.8023 15.1977 19.25 15.75 19.25L18.25 19.25C18.8023 19.25 19.25 18.8023 19.25 18.25V15.75C19.25 15.1977 18.8023 14.75 18.25 14.75Z"
        stroke="#currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.75 11.25L19.25 11.25"
        stroke="#currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.75 7.75L15.25 7.75"
        stroke="#currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.75 4.75L17.25 4.75C18.3546 4.75 19.25 5.64543 19.25 6.75L19.25 8.25"
        stroke="#currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.25 4.75L5.75 4.75C5.19772 4.75 4.75 5.19772 4.75 5.75L4.75 8.25C4.75 8.80228 5.19772 9.25 5.75 9.25L8.25 9.25C8.80228 9.25 9.25 8.80228 9.25 8.25L9.25 5.75C9.25 5.19772 8.80228 4.75 8.25 4.75Z"
        stroke="#currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
