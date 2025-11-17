import { IconProps } from "./types";

export function UiBottom({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentCollor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M4.75 6.75a2 2 0 0 1 2-2h10.5a2 2 0 0 1 2 2v10.5a2 2 0 0 1-2 2H6.75a2 2 0 0 1-2-2V6.75Z"
      />
      <path
        stroke="currentCollor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M7.75 13.75a1 1 0 0 1 1-1h6.5a1 1 0 0 1 1 1v1.5a1 1 0 0 1-1 1h-6.5a1 1 0 0 1-1-1v-1.5Z"
      />
    </svg>
  );
}
