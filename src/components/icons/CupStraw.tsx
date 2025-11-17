import { IconProps } from "./types";

export function CupStraw({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M16.25 9.794c0 1.13-1.903 2.045-4.25 2.045s-4.25-.915-4.25-2.045m8.5 0c0-1.129-1.903-2.044-4.25-2.044s-4.25.915-4.25 2.044m8.5 0-.81 7.666a2 2 0 0 1-1.99 1.79h-2.9a2 2 0 0 1-1.99-1.79l-.81-7.666m4-.544v-2.5a2 2 0 0 1 2-2h2.5"
      />
    </svg>
  );
}
