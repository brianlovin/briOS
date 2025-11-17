import { IconProps } from "./types";

export function Contrast({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        fill="#141414"
        d="M11.75 7.75V7a.75.75 0 0 0-.75.75h.75Zm0 8.5H11c0 .414.336.75.75.75v-.75ZM18.5 12a6.5 6.5 0 0 1-6.5 6.5V20a8 8 0 0 0 8-8h-1.5ZM12 18.5A6.5 6.5 0 0 1 5.5 12H4a8 8 0 0 0 8 8v-1.5ZM5.5 12A6.5 6.5 0 0 1 12 5.5V4a8 8 0 0 0-8 8h1.5ZM12 5.5a6.5 6.5 0 0 1 6.5 6.5H20a8 8 0 0 0-8-8v1.5Zm3.5 6.5c0 1.945-1.547 3.5-3.429 3.5V17C14.805 17 17 14.75 17 12h-1.5Zm-3.429-3.5c1.882 0 3.429 1.555 3.429 3.5H17c0-2.75-2.195-5-4.929-5v1.5Zm0-1.5h-.321v1.5h.321V7Zm0 8.5h-.321V17h.321v-1.5Zm.429.75v-8.5H11v8.5h1.5Z"
      />
    </svg>
  );
}
