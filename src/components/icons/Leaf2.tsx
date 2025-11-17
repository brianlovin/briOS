import { IconProps } from "./types";

export function Leaf2({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M4.75 19.25L11.25 12.75M9.83829 7.69792L12.25 5.75V9.25C12.25 9.25 16 9 16.25 4.75H19.25V7.58058C19.25 10.4103 18.1259 13.1241 16.125 15.125C14.1241 17.1259 11.4103 18.25 8.58058 18.25H5.75V16.2553C5.75 12.9317 7.25272 9.78626 9.83829 7.69792Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
