import { IconProps } from "./types";

export function FolderShare({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="#141414"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M4.75 7.75h12.5a2 2 0 0 1 2 2v7.5a2 2 0 0 1-2 2h-3.5m-.25-11.5-.931-1.958a2 2 0 0 0-1.756-1.042H6.75a2 2 0 0 0-2 2v3.5m0 9 5.5-5.5m0 0h-3.5m3.5 0v3.5"
      />
    </svg>
  );
}
