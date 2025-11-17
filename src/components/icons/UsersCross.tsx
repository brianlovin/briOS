import { IconProps } from "./types";

export function UsersCross({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M12.25 7.5C12.25 9.01878 11.0188 10.25 9.5 10.25C7.98122 10.25 6.75 9.01878 6.75 7.5C6.75 5.98122 7.98122 4.75 9.5 4.75C11.0188 4.75 12.25 5.98122 12.25 7.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.75 10.25C16.2688 10.25 17.25 9.01878 17.25 7.5C17.25 5.98122 16.2688 4.75 14.75 4.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.25 19.25H5.68541C5.11169 19.25 4.65945 18.7838 4.76551 18.2296C5.06982 16.6392 6.08803 13.75 9.46967 13.75C10.487 13.75 11.25 14.25 11.25 14.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19.25 19.25L15.75 15.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.75 19.25L19.25 15.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
