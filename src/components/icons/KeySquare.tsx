import { IconProps } from "./types";

export function KeySquare({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M11.348 9.464 5.75 15.062v3.188h3.5v-2h2V15l2.931-2.702m.569-3.548.5.5m-1.48-4.214L11.036 7.77a.978.978 0 0 0 0 1.383l3.811 3.81a.978.978 0 0 0 1.383 0l2.734-2.733a.978.978 0 0 0 0-1.383l-3.811-3.81a.978.978 0 0 0-1.383 0Z"
      />
    </svg>
  );
}
