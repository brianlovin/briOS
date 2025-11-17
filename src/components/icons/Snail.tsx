import { IconProps } from "./types";

export function Snail({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M13 19.25a4.25 4.25 0 1 1 0-8.5 4.25 4.25 0 0 1 0 8.5Zm0 0h6.25S19.382 16 17.132 16M13 19.25H7.75a3 3 0 0 1-3-3v-5.5a1 1 0 0 1 1-1h.328c.521 0 .955.398 1.01.916.169 1.564.57 4.584 1.162 4.584h.507m4.393 4c-1.326 0-2.4-1.007-2.4-2.25s1.074-2.25 2.4-2.25c.396 0 .77.09 1.1.25m-7.402-4.894L8.25 8.75m-3 1.134V6.75"
      />
    </svg>
  );
}
