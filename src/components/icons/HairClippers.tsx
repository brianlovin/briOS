import { IconProps } from "./types";

export function HairClippers({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M7.75 6.75v2c0 1.873.324 3.39.585 4.307.185.647.324 1.313.324 1.985v.867a3.34 3.34 0 1 0 6.682 0v-.867c0-.673.14-1.338.324-1.985.26-.918.585-2.434.585-4.307v-2m-8.5 0s.048 3.5 4.25 3.5 4.25-3.5 4.25-3.5m-8.5 0h1m7.5 0h-1m-6.5 0v-2m0 2h2m0 0v-2m0 2h2.5m0 0v-2m0 2h2m0 0v-2m-3.25 9v1.5"
      />
    </svg>
  );
}
