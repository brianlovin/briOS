import { IconProps } from "./types";

export function DotsVerticalCircle({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M19.25 12C19.25 16.0041 16.0041 19.25 12 19.25C7.99594 19.25 4.75 16.0041 4.75 12C4.75 7.99594 7.99594 4.75 12 4.75C16.0041 4.75 19.25 7.99594 19.25 12Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.5 15C12.5 15.2761 12.2761 15.5 12 15.5C11.7239 15.5 11.5 15.2761 11.5 15C11.5 14.7239 11.7239 14.5 12 14.5C12.2761 14.5 12.5 14.7239 12.5 15Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.5 12C12.5 12.2761 12.2761 12.5 12 12.5C11.7239 12.5 11.5 12.2761 11.5 12C11.5 11.7239 11.7239 11.5 12 11.5C12.2761 11.5 12.5 11.7239 12.5 12Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.5 9C12.5 9.27614 12.2761 9.5 12 9.5C11.7239 9.5 11.5 9.27614 11.5 9C11.5 8.72386 11.7239 8.5 12 8.5C12.2761 8.5 12.5 8.72386 12.5 9Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
