import { IconProps } from "./types";

export function Skateboard({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M8.25 15C8.25 15.6904 7.69036 16.25 7 16.25C6.30964 16.25 5.75 15.6904 5.75 15C5.75 14.3096 6.30964 13.75 7 13.75C7.69036 13.75 8.25 14.3096 8.25 15Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.75 9.75L5.10046 10.1706C5.67044 10.8545 6.51479 11.25 7.40512 11.25H16.5949C17.4852 11.25 18.3296 10.8545 18.8995 10.1706L19.25 9.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18.25 15C18.25 15.6904 17.6904 16.25 17 16.25C16.3096 16.25 15.75 15.6904 15.75 15C15.75 14.3096 16.3096 13.75 17 13.75C17.6904 13.75 18.25 14.3096 18.25 15Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.75 19.25H19.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
