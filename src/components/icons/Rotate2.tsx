import { IconProps } from "./types";

export function Rotate2({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M6.87347 6.87299C9.70477 4.04169 14.2952 4.04169 17.1265 6.87299C19.9578 9.70429 19.9578 14.2947 17.1265 17.126C14.2952 19.9573 9.70477 19.9573 6.87347 17.126C6.23967 16.4922 5.74775 15.7703 5.39771 14.9996"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.75 19.249V15.749C4.75 15.1967 5.19772 14.749 5.75 14.749H9.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
