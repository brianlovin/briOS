import { IconProps } from "./types";

export function Fan2({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M9.75 5.503c0-.416.366-.753.818-.753 2.034 0 3.682 1.518 3.682 3.39v.61a1 1 0 0 0 1 1h3.247c.416 0 .753.366.753.818 0 2.034-1.518 3.682-3.39 3.682h-.61a1 1 0 0 0-1 1v3.247c0 .416-.366.753-.818.753-2.034 0-3.682-1.518-3.682-3.39v-.61a1 1 0 0 0-1-1H5.503c-.416 0-.753-.366-.753-.818 0-2.034 1.518-3.682 3.39-3.682h.61a1 1 0 0 0 1-1V5.503Z"
      />
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M13.25 12a1.25 1.25 0 1 1-2.5 0 1.25 1.25 0 0 1 2.5 0Z"
      />
    </svg>
  );
}
