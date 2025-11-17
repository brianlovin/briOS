import { IconProps } from "./types";

export function BirdHouse({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M18 10.1293L17.373 17.4302C17.2797 18.4608 16.4159 19.25 15.3811 19.25H8.61889C7.58415 19.25 6.72026 18.4608 6.62702 17.4302L6 10.1293M4.75 11.25L12 4.75L19.25 11.25M14.25 14C14.25 15.2426 13.2426 16.25 12 16.25C10.7574 16.25 9.75 15.2426 9.75 14C9.75 12.7574 10.7574 11.75 12 11.75C13.2426 11.75 14.25 12.7574 14.25 14Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
