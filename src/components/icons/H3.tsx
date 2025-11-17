import { IconProps } from "./types";

export function H3({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M5.75 7.75v8.5m5.5-8.5v8.5m-5.25-4h5m4.913-.25h-.584m.584 0c1.29 0 2.337-.895 2.337-2v-.5c0-.966-.916-1.75-2.045-1.75-.57 0-1.084.2-1.455.52M15.913 12c1.29 0 2.337.895 2.337 2v.5c0 .966-.916 1.75-2.045 1.75-.57 0-1.084-.2-1.455-.52"
      />
    </svg>
  );
}
