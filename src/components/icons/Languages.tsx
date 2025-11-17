import { IconProps } from "./types";

export function Languages({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M6.75 4.75C5.64543 4.75 4.75 5.64543 4.75 6.75V14.25C4.75 15.3546 5.64543 16.25 6.75 16.25H10.75C11.3023 16.25 11.75 16.6977 11.75 17.25V19.25L14.9055 16.6955C15.2616 16.4073 15.7058 16.25 16.1639 16.25H17.25C18.3546 16.25 19.25 15.3546 19.25 14.25V6.75C19.25 5.64543 18.3546 4.75 17.25 4.75H6.75Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.75 13.25L12 7.75L14.25 13.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11 11.25H13"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
