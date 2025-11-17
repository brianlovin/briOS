import { IconProps } from "./types";

export function Cabinet({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M11.75 15.25H12.25M11.75 8.25H12.25M4.75 12.25V17.25C4.75 18.3546 5.64543 19.25 6.75 19.25H17.25C18.3546 19.25 19.25 18.3546 19.25 17.25V12.25M4.75 12.25V5.75C4.75 5.19772 5.19772 4.75 5.75 4.75H18.25C18.8023 4.75 19.25 5.19772 19.25 5.75V12.25M4.75 12.25H19.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
