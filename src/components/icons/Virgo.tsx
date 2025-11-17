import { IconProps } from "./types";

export function Virgo({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M4.75 4.75002C4.75 4.75002 6.25 4.65685 6.25 7.00002V13.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.25 15.25V7C10.25 5.89543 9.35457 5 8.25 5C7.14543 5 6.25 5.89543 6.25 7V15.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.25 19.25C16.7312 19.25 17.9606 14.6232 18.2107 11.9141C18.3104 10.8347 17.415 10 16.3309 10C15.1817 10 14.25 10.9317 14.25 12.0809V14.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.25 15.25V7C10.25 5.89543 11.1454 5 12.25 5C13.3546 5 14.25 5.89543 14.25 7V15.25C14.25 15.25 14.25 19.25 19.25 19.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
