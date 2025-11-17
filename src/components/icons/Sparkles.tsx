import { IconProps } from "./types";

export function Sparkles({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M15 4.75C15 7.51142 13.5114 10 10.75 10C13.5114 10 15 12.4886 15 15.25C15 12.4886 16.4886 10 19.25 10C16.4886 10 15 7.51142 15 4.75Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 12.75C8 14.4069 6.40685 16 4.75 16C6.40685 16 8 17.5931 8 19.25C8 17.5931 9.59315 16 11.25 16C9.59315 16 8 14.4069 8 12.75Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
