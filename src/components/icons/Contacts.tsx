import { IconProps } from "./types";

export function Contacts({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M16.75 4.75h1.5a1 1 0 0 1 1 1v2.5m-2.5-3.5h-9a3 3 0 0 0-3 3v8.5a3 3 0 0 0 3 3h9m0-14.5v3.5m0 11h1.5a1 1 0 0 0 1-1v-2.5m-2.5 3.5v-3.5m0-7.5h2.5m-2.5 0V12m2.5-3.75V12m-2.5 3.75h2.5m-2.5 0V12m2.5 3.75V12m-2.5 0h2.5m-10.5 3.25s.675-1.5 2.25-1.5 2.25 1.5 2.25 1.5m-1-5.25a1.25 1.25 0 1 1-2.5 0 1.25 1.25 0 0 1 2.5 0Z"
      />
    </svg>
  );
}
