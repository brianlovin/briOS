import { IconProps } from "./types";

export function UaeDirham({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M4.75 4.75s2.917 1.607 3.5 7.5m-3.5 7 1-.375m0 0 2-.75m-2 .75V17.75a2 2 0 0 1 2-2h.5m5.5-6v.5a2 2 0 0 0 2 2h3.5S18.75 5 13.75 5M12.5 16a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Z"
      />
    </svg>
  );
}
