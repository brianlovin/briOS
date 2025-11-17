import { IconProps } from "./types";

export function Delete({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M10.75 9.75 13 12m0 0 2.25 2.25M13 12l2.25-2.25M13 12l-2.25 2.25m-6-2.25 3.41 5.328a2 2 0 0 0 1.685.922h7.405a2 2 0 0 0 2-2v-8.5a2 2 0 0 0-2-2H9.845a2 2 0 0 0-1.685.922L4.75 12Z"
      />
    </svg>
  );
}
