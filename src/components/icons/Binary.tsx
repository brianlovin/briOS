import { IconProps } from "./types";

export function Binary({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="m5.75 5.75 2.5-1v5.5m0 0h-2.5m2.5 0h2m3.5 4.5 2.5-1v5.5m0 0h-2.5m2.5 0h2m-4.5-11v-1.5a2 2 0 0 1 2-2h.5a2 2 0 0 1 2 2v1.5a2 2 0 0 1-2 2h-.5a2 2 0 0 1-2-2Zm-8 9v-1.5a2 2 0 0 1 2-2h.5a2 2 0 0 1 2 2v1.5a2 2 0 0 1-2 2h-.5a2 2 0 0 1-2-2Z"
      />
    </svg>
  );
}
