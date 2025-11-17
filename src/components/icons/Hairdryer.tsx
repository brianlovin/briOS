import { IconProps } from "./types";

export function Hairdryer({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M4.75 7.75H5.25M4.75 10.75H5.25M13.686 11.8207L14.6309 18.3866C14.6992 18.8814 15.1221 19.25 15.6215 19.25H17.25C17.8023 19.25 18.25 18.8023 18.25 18.25V11.5M15.75 4.795V12.205M15.8401 4.77823L7.75 6.28446V10.7155L15.8401 12.2218C17.6428 12.4666 19.25 11.0874 19.25 9.29543V7.70457C19.25 5.91263 17.6428 4.53338 15.8401 4.77823Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
