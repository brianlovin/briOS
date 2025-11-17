import { IconProps } from "./types";

export function PhotoError({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M4.75 16L7.49619 12.5067C8.2749 11.5161 10.094 11.8672 10.915 12.823C11.9522 11.5037 13.3973 9.63456 13.4914 9.51295L13.5013 9.50018C14.2815 8.51599 15.7663 8.48582 16.5856 9.43948"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19.25 10.25V6.75C19.25 5.64543 18.3546 4.75 17.25 4.75H6.75C5.64543 4.75 4.75 5.64543 4.75 6.75V17.25C4.75 18.3546 5.64543 19.25 6.75 19.25H9.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19.25 16C19.25 17.7949 17.7949 19.25 16 19.25C14.2051 19.25 12.75 17.7949 12.75 16C12.75 14.2051 14.2051 12.75 16 12.75C17.7949 12.75 19.25 14.2051 19.25 16Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14 14L18 18"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
