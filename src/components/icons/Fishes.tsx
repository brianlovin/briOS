import { IconProps } from "./types";

export function Fishes({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M11.7418 15.9007L8.75 14.75V19.25L11.7418 18.0993C12.4109 18.6702 13.4054 19.25 14.6852 19.25C17.2063 19.25 19.25 18.2426 19.25 17C19.25 15.7574 17.2063 14.75 14.6852 14.75C13.4054 14.75 12.4109 15.3298 11.7418 15.9007Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.37434 7.37434L4.75 4.75V13.25L7.37434 10.6257C8.43631 11.4379 9.99851 12.25 12 12.25C16.0041 12.25 19.25 10.7949 19.25 9C19.25 7.20507 16.0041 5.75 12 5.75C9.99851 5.75 8.43631 6.56206 7.37434 7.37434Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.5 9C15.5 9.27614 15.2761 9.5 15 9.5C14.7239 9.5 14.5 9.27614 14.5 9C14.5 8.72386 14.7239 8.5 15 8.5C15.2761 8.5 15.5 8.72386 15.5 9Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
