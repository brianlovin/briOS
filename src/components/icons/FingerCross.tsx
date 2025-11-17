import { IconProps } from "./types";

export function FingerCross({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M10.0001 19.25L7.75408 13.2607C7.75164 13.2541 7.75316 13.2468 7.75798 13.2418C8.42104 12.5539 9.53454 12.5939 10.1465 13.3276L11.7501 15.25V9C11.7501 8.30964 12.3097 7.75 13.0001 7.75C13.6904 7.75 14.2501 8.30964 14.2501 9V13.25H16.2501C17.9069 13.25 19.2501 14.5931 19.2501 16.25V19.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.25 9.25L4.75 4.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.75 9.25L9.25 4.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
