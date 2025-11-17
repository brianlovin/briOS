import { IconProps } from "./types";

export function Hearts({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M7.66992 5.97022C9.19503 5.22578 11.0131 6.50355 12 7.79068C12.9869 6.50355 14.805 5.22578 16.3301 5.97022C18.0451 6.80734 18.7402 8.84322 17.8827 10.5175C17.0252 12.1917 12 18.25 12 18.25C12 18.25 6.97479 12.1917 6.11729 10.5175C5.25979 8.84322 5.95493 6.80734 7.66992 5.97022Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
