import { IconProps } from "./types";

export function Person({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M14.25 7C14.25 8.24264 13.2426 9.25 12 9.25C10.7574 9.25 9.75 8.24264 9.75 7C9.75 5.75736 10.7574 4.75 12 4.75C13.2426 4.75 14.25 5.75736 14.25 7Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 9.75C8.6 9.75 7.75 11.5 7.75 14.25H9.75V17.25C9.75 18.3546 10.6454 19.25 11.75 19.25H12.25C13.3546 19.25 14.25 18.3546 14.25 17.25V14.25H16.25C16.25 11.5 15.4 9.75 12 9.75Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
