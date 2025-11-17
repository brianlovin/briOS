import { IconProps } from "./types";

export function DialPad({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M10.75 19.25L8.7545 15.2609C8.75182 15.2543 8.75328 15.2467 8.75823 15.2416C9.42116 14.5538 10.5344 14.5937 11.1463 15.3273L12.7501 17.25V10C12.7501 9.30964 13.3097 8.75 14.0001 8.75C14.6905 8.75 15.2501 9.30964 15.2501 10V14.25H17.2501C18.907 14.25 19.2501 15.5931 19.2501 17.25V19.25"
        stroke="#currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 13V13.01"
        stroke="#currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5 13V13.01"
        stroke="#currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 9V9.01"
        stroke="#currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5 9V9.01"
        stroke="#currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13 5V5.01"
        stroke="#currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 5V5.01"
        stroke="#currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5 5V5.01"
        stroke="#currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
