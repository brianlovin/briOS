import { IconProps } from "./types";

export function RectangleFace({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M9.75 9.75V10.25M7.75 13C7.75 13 9 14.25 12 14.25C15 14.25 16.25 13 16.25 13M14.25 9.75V10.25M4.75 5.75H19.25V18.25H4.75V5.75Z"
        stroke="#141414"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
