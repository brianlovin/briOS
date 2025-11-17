import { IconProps } from "./types";

export function DottedCircleRight({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M6.7417 17.4148C7.43555 18.1979 8.28537 18.8272 9.25012 19.2499"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.02472 9.83398C4.84522 10.522 4.75 11.2486 4.75 11.9999C4.75 12.7513 4.84522 13.4779 5.02472 14.1659"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.25012 4.75C8.28537 5.17274 7.43555 5.80194 6.7417 6.5851"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.75 17.2499C11.75 18.3545 12.6612 19.275 13.7264 18.9826C16.8381 18.1286 19.25 15.3258 19.25 11.9999C19.25 8.67407 16.8381 5.87128 13.7264 5.01721C12.6612 4.72485 11.75 5.64535 11.75 6.74992V17.2499Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
