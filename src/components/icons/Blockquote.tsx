import { IconProps } from "./types";

export function Blockquote({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M11.25 11.25C11.25 12.3546 10.3546 13.25 9.25 13.25H6.75C5.64543 13.25 4.75 12.3546 4.75 11.25V9.06349C4.75 8.2262 5.09991 7.427 5.71516 6.85908L8 4.75V7.75H9.25C10.3546 7.75 11.25 8.64543 11.25 9.75V11.25Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19.25 17.25C19.25 18.3546 18.3546 19.25 17.25 19.25H14.75C13.6454 19.25 12.75 18.3546 12.75 17.25V15.0635C12.75 14.2262 13.0999 13.427 13.7152 12.8591L16 10.75V13.75H17.25C18.3546 13.75 19.25 14.6454 19.25 15.75V17.25Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
