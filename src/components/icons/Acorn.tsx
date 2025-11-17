import { IconProps } from "./types";

export function Acorn({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M16.712 7.288a5.25 5.25 0 0 0-7.424 0l7.424 7.424a5.25 5.25 0 0 0 0-7.424Zm0 0L18.25 5.75m-1.538 1.538L13 11M9.75 7.75l-2.37 2.518a6 6 0 0 0-1.63 4.112v3.87h3.87a6 6 0 0 0 4.113-1.63l2.517-2.37m-2.122-8.378L11 9m7.128.872L15 13"
      />
    </svg>
  );
}
