import { IconProps } from "./types";

export function EyeDropper({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M12.75 6.75L17.25 11.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.1406 7.8594L15.8359 6.16409C16.3882 5.61181 17.2837 5.61181 17.8359 6.16409C18.3882 6.71638 18.3882 7.61181 17.8359 8.16409L16.1406 9.8594"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.75 7.75L5.75 16V16.25C5.75 17.3546 6.64543 18.25 7.75 18.25H8L16.25 10.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
