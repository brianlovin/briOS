import { IconProps } from "./types";

export function Wiper({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="m12.25 19.25-2.5-9.5m-4.214-3.4A35.33 35.33 0 0 1 12 5.75a35.3 35.3 0 0 1 6.464.6c.46.088.786.496.786.965v7.174c0 .682-.668 1.165-1.329.997A24.447 24.447 0 0 0 12 14.75c-1.969 0-4.04.256-5.921.736-.66.168-1.329-.315-1.329-.997V7.315c0-.47.326-.877.786-.965Z"
      />
    </svg>
  );
}
