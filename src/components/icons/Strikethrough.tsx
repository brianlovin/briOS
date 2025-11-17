import { IconProps } from "./types";

export function Strikethrough({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M4.75 12.25H19.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18.25 8.25V8C18.25 6.34315 16.9069 5 15.25 5H8.75C7.09315 5 5.75 6.34315 5.75 8V9.25C5.75 10.9069 7.09315 12.25 8.75 12.25H15"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.75 15.75V16.25C5.75 17.9069 7.09315 19.25 8.75 19.25H15.25C16.9069 19.25 18.25 17.9069 18.25 16.25V14.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
