import { IconProps } from "./types";

export function Figma({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M12 9.66667H9.33333C8.04467 9.66667 7 8.622 7 7.33333C7 6.04467 8.04467 5 9.33333 5H12V9.66667Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 14.3333H9.33333C8.04467 14.3333 7 13.2887 7 12C7 10.7113 8.04467 9.66666 9.33333 9.66666H12V14.3333Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 19H9.33333C8.04467 19 7 17.9553 7 16.6667C7 15.378 8.04467 14.3333 9.33333 14.3333H12V17C12 18.1046 11.1046 19 10 19Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 9.66667H14.6667C15.9553 9.66667 17 8.622 17 7.33333C17 6.04467 15.9553 5 14.6667 5H12V9.66667Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.3333 14.3333H14.6667C15.9553 14.3333 17 13.2887 17 12C17 10.7113 15.9553 9.66666 14.6667 9.66666H14.3333C13.0447 9.66666 12 10.7113 12 12C12 13.2887 13.0447 14.3333 14.3333 14.3333Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
