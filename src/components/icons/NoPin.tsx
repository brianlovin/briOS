import { IconProps } from "./types";

export function NoPin({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M5.83128 10C5.77788 10.325 5.75 10.6589 5.75 11C5.75 15 12 19.25 12 19.25C12 19.25 12.6944 18.7778 13.6204 18M16.1625 15.5C17.3119 14.1369 18.25 12.5497 18.25 11C18.25 7.5 15.3137 4.75 12 4.75C10.2286 4.75 8.56507 5.53584 7.40027 6.80199"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.4089 9.40901C11.2876 8.53033 12.7122 8.53033 13.5909 9.40901C14.4696 10.2877 14.4696 11.7123 13.5909 12.591"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.75 4.75L19.25 19.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
