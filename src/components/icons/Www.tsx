import { IconProps } from "./types";

export function Www({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M19.25 12A7.25 7.25 0 0 0 12 4.75M19.25 12H4.75m14.5 0c0 .694-.097 1.365-.28 2M4.75 12A7.25 7.25 0 0 1 12 4.75M4.75 12c0 .694.097 1.365.28 2M12 4.75c-1.243 0-3.25 2.75-3.25 7.25 0 .712.05 1.38.14 2M12 4.75c1.243 0 3.25 2.75 3.25 7.25 0 .712-.05 1.38-.14 2m-9.86 2.75.5 2.5L7 17.75l1.25 1.5.5-2.5m1.5 0 .5 2.5 1.25-1.5 1.25 1.5.5-2.5m1.5 0 .5 2.5 1.25-1.5 1.25 1.5.5-2.5"
      />
    </svg>
  );
}
