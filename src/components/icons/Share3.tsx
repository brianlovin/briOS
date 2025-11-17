import { IconProps } from "./types";

export function Share3({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M8.25 10.75h-.5a2 2 0 0 0-2 2v4.5a2 2 0 0 0 2 2h8.5a2 2 0 0 0 2-2v-4.5a2 2 0 0 0-2-2h-.5M12 14.25v-9.5m0 0-2.25 2.5M12 4.75l2.25 2.5"
      />
    </svg>
  );
}
