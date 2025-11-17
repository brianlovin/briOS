import { IconProps } from "./types";

export function Hook({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M12 7.25a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5Zm0 0V8c0 2.4-4.25 4-4.25 7s1.903 4.25 4.25 4.25A4.25 4.25 0 0 0 16.25 15"
      />
    </svg>
  );
}
