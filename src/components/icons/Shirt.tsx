import { IconProps } from "./types";

export function Shirt({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M12 6.75c-1.5 0-2-2-2-2L4.75 8v3.25h2.5v8h9.5v-8h2.5V8L14 4.75s-.5 2-2 2Z"
      />
    </svg>
  );
}
