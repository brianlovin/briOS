import { IconProps } from "./types";

export function ShoppingBasketCross({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="m15.75 15.75 1.75 1.75m0 0 1.75 1.75M17.5 17.5l1.75-1.75M17.5 17.5l-1.75 1.75m2.5-9.5H5.75m12.5 0h1m-1 0-.531 2.5M5.75 9.75l1.666 7.912a2 2 0 0 0 1.957 1.588h1.877m-5.5-9.5h-1m4 0v-2a3 3 0 0 1 3-3h.5a3 3 0 0 1 3 3v2"
      />
    </svg>
  );
}
