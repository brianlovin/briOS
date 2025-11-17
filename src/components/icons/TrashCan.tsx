import { IconProps } from "./types";

export function TrashCan({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M19.25 6.5C19.25 7.4665 16.0041 8.25 12 8.25C7.99594 8.25 4.75 7.4665 4.75 6.5C4.75 5.5335 7.99594 4.75 12 4.75C16.0041 4.75 19.25 5.5335 19.25 6.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.75 6.75L6.21111 15.882C6.52159 17.8225 8.19569 19.25 10.1609 19.25H13.8391C15.8043 19.25 17.4784 17.8225 17.7889 15.882L19.25 6.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
