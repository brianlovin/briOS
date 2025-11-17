import { IconProps } from "./types";

export function FolderOpenCheck({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M4.75 17.25V6.75a2 2 0 0 1 2-2h1.311a2 2 0 0 1 1.418.59l.899.903a2 2 0 0 0 1.418.59h5.1a1 1 0 0 1 .956 1.294l-.807 2.623M4.75 17.25h6.5m-6.5 0 1.783-5.794a1 1 0 0 1 .956-.706h9.556m0 0h2.205m0 4s-1.929 2.09-2.893 4.5l-1.607-1.929"
      />
    </svg>
  );
}
