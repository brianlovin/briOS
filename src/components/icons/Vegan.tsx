import { IconProps } from "./types";

export function Vegan({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M4.75 4.75S12 11 12 19c0-8 3.75-10.75 3.75-10.75m.403-2.194c-.52.96-.388 2.18-.388 2.18s1.22.13 2.179-.389m-1.791-1.79c.1-.188.227-.365.383-.521.958-.958 2.7-.771 2.7-.771s.186 1.74-.772 2.699a2.235 2.235 0 0 1-.52.383m-1.791-1.79a7.25 7.25 0 1 0 1.79 1.79"
      />
    </svg>
  );
}
