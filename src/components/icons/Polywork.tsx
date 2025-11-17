import { IconProps } from "./types";

export function Polywork({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M5 7.33333C5 6.04467 6.04467 5 7.33333 5H9.66667V9.66667H5V7.33333Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18.9999 7.33333C18.9999 6.04467 17.9552 5 16.6666 5H14.3333V9.66667H18.9999V7.33333Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18.9999 12C18.9999 13.2887 17.9552 14.3334 16.6666 14.3334H14.3333V9.66669H18.9999V12Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5 16.6666C5 17.9553 6.04467 19 7.33333 19H9.66667V14.3333H5V16.6666Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.3334 16.6666C14.3334 17.9553 13.2887 19 12.0001 19H9.66675V14.3333H14.3334V16.6666Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5 9.66669H9.66667V14.3334H5V9.66669Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.66675 5H14.3334V9.66667H9.66675V5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.66675 9.66669H14.3334V14.3334H9.66675V9.66669Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
