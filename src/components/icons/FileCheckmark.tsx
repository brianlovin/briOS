import { IconProps } from "./types";

export function FileCheckmark({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M12.75 4.75h-5a2 2 0 0 0-2 2v10.5a2 2 0 0 0 2 2h3.5m1.5-14.5v3.5a2 2 0 0 0 2 2h3.5m-5.5-5.5 5.5 5.5m0 0v1m1 3.5s-1.929 2.09-2.893 4.5l-1.607-1.929"
      />
    </svg>
  );
}
