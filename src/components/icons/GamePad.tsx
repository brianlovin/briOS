import { IconProps } from "./types";

export function GamePad({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M9.75 5.75V7.6L12 9.25l2.25-1.65V5.75a1 1 0 0 0-1-1h-2.5a1 1 0 0 0-1 1Zm8.5 4H16.4L14.75 12l1.65 2.25h1.85a1 1 0 0 0 1-1v-2.5a1 1 0 0 0-1-1Zm-8.5 8.5V16.4L12 14.75l2.25 1.65v1.85a1 1 0 0 1-1 1h-2.5a1 1 0 0 1-1-1Zm-4-8.5H7.6L9.25 12 7.6 14.25H5.75a1 1 0 0 1-1-1v-2.5a1 1 0 0 1 1-1Z"
      />
    </svg>
  );
}
