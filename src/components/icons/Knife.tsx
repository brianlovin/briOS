import { IconProps } from "./types";

export function Knife({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="m13.218 15.625 3.62 3.625 2.412-2.417-3.619-3.625m-2.413 2.417 2.413-2.417m-2.413 2.417-2.412 2.417-4.362-4.37a5.783 5.783 0 0 1 0-8.178l.743-.744 8.444 8.458"
      />
    </svg>
  );
}
