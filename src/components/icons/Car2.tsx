import { IconProps } from "./types";

export function Car2({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="m6.75 8.75-.894.447a2 2 0 0 0-1.106 1.79v1.263a1 1 0 0 0 1 1H6m.75-4.5.772-2.316a1 1 0 0 1 .949-.684H12m-5.25 3a1.5 1.5 0 0 0 1.5 1.5H12v-4.5m3 7.5H9m9 0h.25a1 1 0 0 0 1-1v-1.264a2 2 0 0 0-1.106-1.789l-.894-.447-.772-2.316a1 1 0 0 0-.949-.684H12m-7.25 13.5h14.5m-10-4.75a1.75 1.75 0 1 0-3.5 0 1.75 1.75 0 0 0 3.5 0Zm9 0a1.75 1.75 0 1 0-3.5 0 1.75 1.75 0 0 0 3.5 0Z"
      />
    </svg>
  );
}
