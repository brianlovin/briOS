import { IconProps } from "./types";

export function GivingMoney({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M7.25 19.25h-2.5v-6.5h2.5v2m0 4.5v-4.5m0 4.5c6.75 0 12-3.25 12-3.25v-2.25h-6m-6 1 3.53-1.882a1 1 0 0 1 .47-.118h1a1 1 0 0 1 1 1m-2.5 2.5 2.5-1.25v-1.25m4.75-3.5h.125a1.125 1.125 0 0 0 0-2.25h-.25a1.125 1.125 0 0 1 0-2.25H18m0 4.5h-1.25m1.25 0v1m0-5.5h1.25m-1.25 0v-1"
      />
    </svg>
  );
}
