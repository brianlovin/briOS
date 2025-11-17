import { IconProps } from "./types";

export function FolderOpen2({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M4.75 18.25V7.75c0-1.105.918-2 2.05-2h1.368c.531 0 1.042.201 1.424.561l.932.878c.382.36.892.561 1.424.561h5.302a1 1 0 0 1 1 1v3m-13.5 6.5h12.812l1.642-5.206c.2-.635-.278-1.278-.954-1.294m-13.5 6.5 1.827-5.794c.133-.42.53-.706.98-.706H18.25"
      />
    </svg>
  );
}
