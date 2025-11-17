import { IconProps } from "./types";

export function Vibrate({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="m18.75 8.75.5 1.25-.379 1.515a1.99 1.99 0 0 0 0 .97L19.25 14l-.5 1.25m-13.5-6.5L4.75 10l.379 1.515a2 2 0 0 1 0 .97L4.75 14l.5 1.25m6.5-7.5h.5m-5 9.5V6.75a2 2 0 0 1 2-2h5.5a2 2 0 0 1 2 2v10.5a2 2 0 0 1-2 2h-5.5a2 2 0 0 1-2-2Z"
      />
    </svg>
  );
}
