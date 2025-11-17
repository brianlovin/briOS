import { IconProps } from "./types";

export function CreditCardPlus({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M17 14.75v4.5M19.25 17h-4.5M5 10.25h14m-11.25 4h3.5m0 4h-4.5a2 2 0 0 1-2-2v-8.5a2 2 0 0 1 2-2h10.5a2 2 0 0 1 2 2v4.5"
      />
    </svg>
  );
}
