import { IconProps } from "./types";

export function CarBattery({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="m8.75 7.75.724-1.447a1 1 0 0 1 .894-.553h3.264a1 1 0 0 1 .894.553l.724 1.447m-6.5 0h6.5m-6.5 0H7m8.25 0H17m0 0h1.25a1 1 0 0 1 1 1v9.5a1 1 0 0 1-1 1H5.75a1 1 0 0 1-1-1v-9.5a1 1 0 0 1 1-1H7m10 0v-1m-10 1v-1"
      />
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="m12.25 10.75-1.5 2.5h2.5l-1.5 3"
      />
    </svg>
  );
}
