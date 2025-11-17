import { IconProps } from "./types";

export function Radiation({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M9.69 4.75c-2.627.891-4.59 3.26-4.94 6.137l5 .637a2.302 2.302 0 0 1 1.533-1.905L9.689 4.75Zm3.027 4.869 1.594-4.869c2.626.891 4.59 3.26 4.939 6.137l-5 .637a2.302 2.302 0 0 0-1.533-1.905Zm.601 4.071 2.929 4.175A7.185 7.185 0 0 1 12 19.25a7.184 7.184 0 0 1-4.247-1.385l2.93-4.176a2.23 2.23 0 0 0 2.635 0Z"
      />
    </svg>
  );
}
