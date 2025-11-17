import { IconProps } from "./types";

export function Razor({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M11.75 6.875L13.875 4.75L19.25 10.125L17.125 12.25L11.75 6.875Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.8013 15.3654L7.3654 18.8013C7.07808 19.0886 6.68839 19.25 6.28206 19.25C5.43593 19.25 4.75 18.5641 4.75 17.7179C4.75 17.3116 4.91141 16.9219 5.19873 16.6346L8.6346 13.1987C8.92192 12.9114 9.31161 12.75 9.71794 12.75C10.5641 12.75 11.25 13.4359 11.25 14.2821C11.25 14.6884 11.0886 15.0781 10.8013 15.3654Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11 13L14 10"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
