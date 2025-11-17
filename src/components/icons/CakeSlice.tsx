import { IconProps } from "./types";

export function CakeSlice({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M8.75 6.5C8.75 5.5335 9.5335 4.75 10.5 4.75H11.25M19.25 14.75L19.25 14.1168C19.25 13.0656 18.4363 12.1939 17.3876 12.1216L4.75 11.25L4.75002 14.75M19.25 14.75L19.2501 18.25C19.2501 18.8023 18.8024 19.25 18.2501 19.25H5.75006C5.19778 19.25 4.75007 18.8023 4.75006 18.25L4.75002 14.75M19.25 14.75H4.75002M11.25 9C11.25 10.2426 10.2426 11.25 9 11.25C7.75736 11.25 6.75 10.2426 6.75 9C6.75 7.75736 7.75736 6.75 9 6.75C10.2426 6.75 11.25 7.75736 11.25 9Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
