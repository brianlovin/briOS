import { IconProps } from "./types";

export function Pepper({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="m9.75 7.75-.44-1.757a1 1 0 0 1 .97-1.243h3.44a1 1 0 0 1 .97 1.243l-.44 1.757m-4.5 0h4.5m-4.5 0a2 2 0 0 0-2 2v7.2c0 .79.466 1.51 1.218 1.75.83.266 1.966.55 3.032.55s2.202-.284 3.032-.55c.752-.24 1.218-.96 1.218-1.75v-7.2a2 2 0 0 0-2-2m-3.5 8.5v-2m0 0v-2.5h1.5a1 1 0 0 1 1 1v.5a1 1 0 0 1-1 1h-1.5Z"
      />
    </svg>
  );
}
