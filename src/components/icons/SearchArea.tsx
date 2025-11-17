import { IconProps } from "./types";

export function SearchArea({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M12 16C14.2091 16 16 14.2091 16 12H14.5C14.5 13.3807 13.3807 14.5 12 14.5V16ZM12 9.5C13.3807 9.5 14.5 10.6193 14.5 12H16C16 9.79086 14.2091 8 12 8V9.5ZM12 8C9.79086 8 8 9.79086 8 12H9.5C9.5 10.6193 10.6193 9.5 12 9.5V8ZM12 14.5C10.6193 14.5 9.5 13.3807 9.5 12H8C8 14.2091 9.79086 16 12 16V14.5Z"
        fill="currentColor"
      />
      <path
        d="M14.5 14.5L17.25 17.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.75 8.25V6.75C4.75 5.64543 5.64543 4.75 6.75 4.75H8.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.75 15.75V17.25C4.75 18.3546 5.64543 19.25 6.75 19.25H8.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19.25 8.25V6.75C19.25 5.64543 18.3546 4.75 17.25 4.75H15.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
