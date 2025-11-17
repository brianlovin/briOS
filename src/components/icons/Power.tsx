import { IconProps } from "./types";

export function Power({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M6.87348 6.87347C4.04217 9.70478 4.04217 14.2952 6.87348 17.1265C9.70478 19.9578 14.2952 19.9578 17.1265 17.1265C19.9578 14.2952 19.9578 9.70478 17.1265 6.87347"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 4.75V11.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
