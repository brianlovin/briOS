import { IconProps } from "./types";

export function Paintbucket2({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M7.64214 18.3765L5.63478 16.3691C4.46407 15.1984 4.46309 13.3006 5.63257 12.1287L11 6.75L17.25 13L11.887 18.3743C10.7158 19.5479 8.81458 19.5489 7.64214 18.3765Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19.25 18C19.25 18.6904 18.6904 19.25 18 19.25C17.3096 19.25 16.75 18.6904 16.75 18C16.75 17.3096 17.3096 15.75 18 15.75C18.6904 15.75 19.25 17.3096 19.25 18Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.75 12.25V4.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
