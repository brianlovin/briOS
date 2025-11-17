import { IconProps } from "./types";

export function Poll({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M12.75 7h6.5m-6.5 10h6.5M7 9.25a2.25 2.25 0 1 1 0-4.5 2.25 2.25 0 0 1 0 4.5Zm0 10a2.25 2.25 0 1 1 0-4.5 2.25 2.25 0 0 1 0 4.5Z"
      />
    </svg>
  );
}
