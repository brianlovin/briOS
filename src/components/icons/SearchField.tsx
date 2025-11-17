import { IconProps } from "./types";

export function SearchField({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M14 18C16.2091 18 18 16.2091 18 14H16.5C16.5 15.3807 15.3807 16.5 14 16.5V18ZM14 11.5C15.3807 11.5 16.5 12.6193 16.5 14H18C18 11.7909 16.2091 10 14 10V11.5ZM14 10C11.7909 10 10 11.7909 10 14H11.5C11.5 12.6193 12.6193 11.5 14 11.5V10ZM14 16.5C12.6193 16.5 11.5 15.3807 11.5 14H10C10 16.2091 11.7909 18 14 18V16.5Z"
        fill="currentColor"
      />
      <path
        d="M16.5 16.5L19.25 19.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.25 12.25H6.75C5.64543 12.25 4.75 11.3546 4.75 10.25V6.75C4.75 5.64543 5.64543 4.75 6.75 4.75H17.25C18.3546 4.75 19.25 5.64543 19.25 6.75V9.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
