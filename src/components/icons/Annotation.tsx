import { IconProps } from "./types";

export function Annotation({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M4.75 6.75C4.75 5.64543 5.64543 4.75 6.75 4.75H17.25C18.3546 4.75 19.25 5.64543 19.25 6.75V15.25C19.25 16.3546 18.3546 17.25 17.25 17.25H14.625L12 19.25L9.375 17.25H6.75C5.64543 17.25 4.75 16.3546 4.75 15.25V6.75Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
