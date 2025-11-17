import { IconProps } from "./types";

export function Umbrella({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M12 13.5V17.625C12 18.5225 11.2725 19.25 10.375 19.25C9.47754 19.25 8.75 18.5225 8.75 17.625V16.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 4.75V5.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 5.75C7.99594 5.75 4.75 8.24594 4.75 12.25C4.75 12.25 7.5 13.25 12 13.25C16.5 13.25 19.25 12.25 19.25 12.25C19.25 8.24594 16.0041 5.75 12 5.75Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 5.75C12 5.75 8.75 8.5 8.75 13"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 5.75C12 5.75 15.25 8.5 15.25 13"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
