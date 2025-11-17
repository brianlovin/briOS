import { IconProps } from "./types";

export function Grid3({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M12 19.25h5.25a2 2 0 0 0 2-2V12M12 19.25H6.75a2 2 0 0 1-2-2V12M12 19.25V4.75m0 0H6.75a2 2 0 0 0-2 2V12M12 4.75h5.25a2 2 0 0 1 2 2V12m-14.5 0h14.5"
      />
    </svg>
  );
}
