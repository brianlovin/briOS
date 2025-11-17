import { IconProps } from "./types";

export function Skew({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="m9.25 5.23-2.116-.44c-1.236-.256-2.384.75-2.384 2.086V12m4.5-6.77v13.54m0-13.54 6 1.319m-6 12.221-2.116.44c-1.236.256-2.384-.749-2.384-2.086V12m4.5 6.77 6-1.319m0-10.902 2.43.567c.917.215 1.57 1.078 1.57 2.076V12m-4-5.451V17.45m0 0 2.43-.567c.917-.215 1.57-1.078 1.57-2.076V12m-14.5 0h14.5"
      />
    </svg>
  );
}
