import { IconProps } from "./types";

export function Tooth({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M8.375 4.75c2.071 0 3.28.69 3.625 1.036.345-.346 1.554-1.036 3.625-1.036 2.59 0 3.625 2.071 3.625 4.143 0 2.071-2.071 6.214-2.071 6.214S16.554 19.25 15 19.25c-2 0-3-5.5-3-5.5s-1 5.5-3 5.5c-1.554 0-2.179-4.143-2.179-4.143S4.75 10.964 4.75 8.893c0-2.072 1.036-4.143 3.625-4.143Z"
      />
    </svg>
  );
}
