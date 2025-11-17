import { IconProps } from "./types";

export function NoAvatar({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M5.398 9A7.25 7.25 0 0 0 15 18.602m2.363-1.723A7.25 7.25 0 0 0 7.089 6.666m2.784 2.599a2.251 2.251 0 1 1 2.885 2.854M7.198 17A6.243 6.243 0 0 1 11 14.83l.25-.03M4.75 4.75l14.5 14.5"
      />
    </svg>
  );
}
