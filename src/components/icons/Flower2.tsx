import { IconProps } from "./types";

export function Flower2({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M10 10 8.75 8.75M14 10l1.25-1.25m-6.5 6.5L10 14m5.25 1.25L14 14m-5.75-2c-1.933 0-3.5-1.817-3.5-3.75a3.5 3.5 0 0 1 3.5-3.5c1.933 0 3.75 1.567 3.75 3.5M8.25 12H9.5m-1.25 0c-1.933 0-3.5 1.817-3.5 3.75a3.5 3.5 0 0 0 3.5 3.5c1.933 0 3.75-1.567 3.75-3.5m0-7.5V9.5m0-1.25c0-1.933 1.817-3.5 3.75-3.5a3.5 3.5 0 0 1 3.5 3.5c0 1.933-1.567 3.75-3.5 3.75m0 0H14.5m1.25 0c1.933 0 3.5 1.817 3.5 3.75a3.5 3.5 0 0 1-3.5 3.5c-1.933 0-3.75-1.567-3.75-3.5m0 0V14.5m2.25-2.5a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
      />
    </svg>
  );
}
