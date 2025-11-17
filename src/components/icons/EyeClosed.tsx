import { IconProps } from "./types";

export function EyeClosed({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M5.75 8.25C6.62017 7.13341 8.42054 5.75 12 5.75C15.5795 5.75 17.3798 7.13341 18.25 8.25M5.75 13.75C6.24116 14.3803 7.02868 15.0955 8.26521 15.599M8.26521 15.599C9.21939 15.9876 10.4409 16.25 12 16.25M8.26521 15.599L7.75 18.25M12 16.25C13.5591 16.25 14.7806 15.9876 15.7348 15.599M12 16.25L12 18.25M15.7348 15.599C16.9713 15.0955 17.7588 14.3803 18.25 13.75M15.7348 15.599L16.25 18.25"
        stroke="#141414"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
