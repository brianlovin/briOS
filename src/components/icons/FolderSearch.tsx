import { IconProps } from "./types";

export function FolderSearch({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M10.25 19.25h-3.5a2 2 0 0 1-2-2v-9.5h12.5a2 2 0 0 1 2 2v.5m-5.75-2.5-.931-1.958a2 2 0 0 0-1.756-1.042H6.75a2 2 0 0 0-2 2V11m12.695 6.445 1.805 1.805m-3.75-1a2.75 2.75 0 1 0 0-5.5 2.75 2.75 0 0 0 0 5.5Z"
      />
    </svg>
  );
}
