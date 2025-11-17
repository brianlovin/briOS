import { IconProps } from "./types";

export function Axes({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M12 4.75V13m0-8.25-2.25 2.5M12 4.75l2.25 2.5M12 13l-7.25 6.25M12 13l7.25 6.25m-14.5 0v-2.5m0 2.5h2.5m12 0v-2.5m0 2.5h-2.5"
      />
    </svg>
  );
}
