import { IconProps } from "./types";

export function BuildingMonument({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M4.75 19.25h14.5m-2-.25v-1.75a1 1 0 0 0-1-1H15M6.75 19v-1.75a1 1 0 0 1 1-1H9m0 0 .673-6.283a4 4 0 0 1 .4-1.362L12 4.75l1.927 3.855c.214.426.349.888.4 1.362L15 16.25m-6 0h6"
      />
    </svg>
  );
}
