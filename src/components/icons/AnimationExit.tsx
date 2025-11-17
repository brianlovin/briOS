import { IconProps } from "./types";

export function AnimationExit({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="m13.25 7-.544-.543a2.412 2.412 0 0 0-3.41 0l-3.839 3.837a2.412 2.412 0 0 0 0 3.412l3.838 3.838c.942.941 2.47.941 3.411 0L13.25 17m6-5h-7.5m7.5 0-2.5-2.25m2.5 2.25-2.5 2.25"
      />
    </svg>
  );
}
