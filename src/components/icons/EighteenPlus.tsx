import { IconProps } from "./types";

export function EighteenPlus({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M12.006 12c-1.24 0-2.244.757-2.244 2a2.247 2.247 0 0 0 2.244 2.25A2.247 2.247 0 0 0 14.25 14c0-1.243-1.005-2-2.244-2Zm0 0c1.744 0 1.744-1.534 1.744-2.5a1.75 1.75 0 1 0-3.5 0c0 .966.012 2.5 1.756 2.5ZM18 10.75V12m0 0v1.25M18 12h1.25M18 12h-1.25m-10.5 4.25v-8.5l-1.5 1.5m1.5 7h-1.5m1.5 0h1"
      />
    </svg>
  );
}
