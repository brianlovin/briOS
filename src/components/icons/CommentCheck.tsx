import { IconProps } from "./types";

export function CommentCheck({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M12.25 4.75H12c-3.866 0-7.25 2.095-7.25 6.75 0 1.768.488 3.166 1.305 4.22.239.31.334.72.168 1.073-.1.215-.207.42-.315.615-.454.816.172 2.005 1.087 1.822 1.016-.204 2.153-.508 3.1-.956a1.15 1.15 0 0 1 .635-.103c.415.053.84.079 1.27.079 3.725 0 7.002-1.945 7.237-6.25l.013-.25m0-7s-1.929 2.09-2.893 4.5L14.75 7.321"
      />
    </svg>
  );
}
