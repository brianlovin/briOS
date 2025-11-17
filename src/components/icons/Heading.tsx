import { IconProps } from "./types";

export function Heading({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M5.75 5.75H7.25M7.25 5.75H8.25M7.25 5.75V11.75M7.25 18.25H5.75M7.25 18.25H8.25M7.25 18.25V11.75M7.25 11.75H16.75M16.75 11.75V5.75M16.75 11.75V18.25M18.25 5.75H16.75M16.75 5.75H15.75M16.75 18.25H18.25M16.75 18.25H15.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
