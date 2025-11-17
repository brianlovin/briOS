import { IconProps } from "./types";

export function LuggageCarousel({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M17.25 15.75v-6a1 1 0 0 0-1-1h-2m-7.5 7v-6a1 1 0 0 1 1-1h2m0 0v-1a2 2 0 0 1 2-2h.5a2 2 0 0 1 2 2v1m-4.5 0h4.5M6.5 19.25h11a1.75 1.75 0 1 0 0-3.5h-11a1.75 1.75 0 1 0 0 3.5Z"
      />
    </svg>
  );
}
