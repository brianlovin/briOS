import { IconProps } from "./types";

export function IphoneDualCamera({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M4.75 19.25v-8.5a6 6 0 0 1 6-6h8.5m-8.5 14.5h5.5a3 3 0 0 0 3-3v-5.5a3 3 0 0 0-3-3h-5.5a3 3 0 0 0-3 3v5.5a3 3 0 0 0 3 3Zm1.5-7.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm4 4a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
      />
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11.5 16a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Zm5-5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Z"
      />
    </svg>
  );
}
