import { IconProps } from "./types";

export function Pharmacy({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M5.75 8.63v9.62a1 1 0 0 0 1 1h10.5a1 1 0 0 0 1-1V8.63m-12.5 0-1 .62m1-.62L12 4.75l6.25 3.88m0 0 1 .62m-7.25.5V13m0 0v3.25M12 13h3.25M12 13H8.75"
      />
    </svg>
  );
}
