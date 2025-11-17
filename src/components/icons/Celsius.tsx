import { IconProps } from "./types";

export function Celsius({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M12.25 9.25V8.5C12.25 6.42893 10.5711 4.75 8.5 4.75C6.42893 4.75 4.75 6.42893 4.75 8.5V15.5C4.75 17.5711 6.42893 19.25 8.5 19.25C10.5711 19.25 12.25 17.5711 12.25 15.5V14.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19.25 6.5C19.25 7.4665 18.4665 8.25 17.5 8.25C16.5335 8.25 15.75 7.4665 15.75 6.5C15.75 5.5335 16.5335 4.75 17.5 4.75C18.4665 4.75 19.25 5.5335 19.25 6.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
