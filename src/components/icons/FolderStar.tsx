import { IconProps } from "./types";

export function FolderStar({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M12.25 19.25h-5.5a2 2 0 0 1-2-2v-9.5h12.5a2 2 0 0 1 2 2v.5m-5.75-2.5-.931-1.958a2 2 0 0 0-1.756-1.042H6.75a2 2 0 0 0-2 2V11M17 12.75C17 14 16 16 14.75 16 16 16 17 18 17 19.25 17 18 18 16 19.25 16 18 16 17 14 17 12.75Z"
      />
    </svg>
  );
}
