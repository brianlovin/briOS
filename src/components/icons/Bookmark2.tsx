import { IconProps } from "./types";

export function Bookmark2({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M12 5.75s-1.5-1-3.5-1-3.75 1-3.75 1v13.5s1.75-1 3.75-1 3.5 1 3.5 1m0-13.5s1.5-1 3.5-1c.255 0 .506.016.75.045M12 5.75v13.5m0 0s1.5-1 3.5-1 3.75 1 3.75 1V5.75s-1.332-.761-3-.955m0 0V9.25"
      />
    </svg>
  );
}
