import { IconProps } from "./types";

export function Microphone2({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M19.25 8.5C19.25 10.5711 17.5711 12.25 15.5 12.25C13.4289 12.25 11.75 10.5711 11.75 8.5C11.75 6.42893 13.4289 4.75 15.5 4.75C17.5711 4.75 19.25 6.42893 19.25 8.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.59099 18.591C7.71231 19.4697 6.28769 19.4697 5.40901 18.591C4.53033 17.7123 4.53033 16.2877 5.40901 15.409"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.5 9.32031L5.50781 15.3125"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.6797 12.5L8.625 18.5547"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13 6L18 11"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
