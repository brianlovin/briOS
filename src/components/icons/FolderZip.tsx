import { IconProps } from "./types";

export function FolderZip({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="m13.5 7.75-.931-1.958a2 2 0 0 0-1.756-1.042H6.75a2 2 0 0 0-2 2V11M14 19.25H6.75a2 2 0 0 1-2-2v-9.5h12.5a2 2 0 0 1 2 2v7.5a2 2 0 0 1-2 2H14Zm0 0v-7.5m-1.25 2h2.5m-2.5 2.5h2.5"
      />
    </svg>
  );
}
