import { IconProps } from "./types";

export function LaptopAndPhone({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M19.25 7.25v-.5a2 2 0 0 0-2-2h-9.5a2 2 0 0 0-2 2v8.5m0 0h-.215a.75.75 0 0 0-.75.75 2.25 2.25 0 0 0 2.25 2.25h3.215m-4.5-3h4.5M16 17h.01m-1.26 2.25h2.5a2 2 0 0 0 2-2v-5.5a2 2 0 0 0-2-2h-2.5a2 2 0 0 0-2 2v5.5a2 2 0 0 0 2 2Z"
      />
    </svg>
  );
}
