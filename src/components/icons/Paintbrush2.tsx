import { IconProps } from "./types";

export function Paintbrush2({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M12.7888 8.7361L16.1972 5.32785C16.9167 4.60838 18.0539 4.57914 18.7374 5.26256C19.4208 5.94598 19.3915 7.08325 18.6721 7.80273L15.2374 11.2374"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.6665 11.6665L12.3335 8.33347C11.5847 7.58468 10.382 7.54934 9.59053 8.25287L8.75 9L15 15.25L15.7471 14.4095C16.4507 13.618 16.4153 12.4153 15.6665 11.6665Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 10L4.75 12.75L11.25 19.25L14 15"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7 15L8.25 13.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
