import { IconProps } from "./types";

export function GalleryVertical({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M8.75 4.75h6.5m-8.5 3h10.5m-11.5 11.5h12.5a1 1 0 0 0 1-1v-6.5a1 1 0 0 0-1-1H5.75a1 1 0 0 0-1 1v6.5a1 1 0 0 0 1 1Z"
      />
    </svg>
  );
}
