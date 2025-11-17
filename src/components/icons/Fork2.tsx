import { IconProps } from "./types";

export function Fork2({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="m6.125 10.375 1.29 1.29c.374.374.888.608 1.408.505l1.141-.4 7.106 7.106a1.277 1.277 0 1 0 1.806-1.806L11.77 9.964l.4-1.14c.103-.521-.13-1.035-.506-1.41l-1.289-1.289m-4.25 4.25L4.75 9m1.375 1.375c2.078-2.078 1.492-2.758.71-3.54m0 0L6.75 6.75m.086.086a2 2 0 0 0 2.828 0l.711-.711m0 0L9 4.75"
      />
    </svg>
  );
}
