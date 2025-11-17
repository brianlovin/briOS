import { IconProps } from "./types";

export function CircleDotted({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.5"
        d="M12 5v.01m3.502.928-.005.01m2.57 2.554-.01.005m.948 3.497h-.01m-.928 3.502-.009-.005m-2.555 2.57-.005-.01M12 19v.01m-3.498-.947-.005.009m-2.555-2.57-.008.005m-.929-3.502h-.01m.947-3.498-.008-.005m2.568-2.555-.005-.008"
      />
    </svg>
  );
}
