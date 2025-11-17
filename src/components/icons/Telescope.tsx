import { IconProps } from "./types";

export function Telescope({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M8.67641 12.3872L9.15839 13.3564C9.40399 13.8502 10.003 14.0519 10.4973 13.8073L11 13.5585M8.67641 12.3872L8.14195 11.3126C7.91787 10.862 8.0635 10.3151 8.48199 10.0357L16.3972 4.75L19.25 9.47551L11 13.5585M8.67641 12.3872L4.75 14.25M11 13.5585L7.75 19.25M11 13.5585L14.25 19.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
