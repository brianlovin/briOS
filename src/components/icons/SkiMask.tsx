import { IconProps } from "./types";

export function SkiMask({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M19.25 19V12C19.25 7.99594 16.0041 4.75 12 4.75C7.99594 4.75 4.75 7.99594 4.75 12V19"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.7816 18.25H13.2185C13.783 18.25 14.234 17.7739 14.0404 17.2437C13.7869 16.5491 13.2282 15.75 12 15.75C10.7718 15.75 10.2132 16.5491 9.95964 17.2437C9.76608 17.7739 10.2171 18.25 10.7816 18.25Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15 10.75C13.5784 10.75 13.7208 11.853 13.7902 12.1673C13.8026 12.2232 13.8146 12.2783 13.8283 12.3339C13.8877 12.5746 14.1316 13.25 15 13.25C15.8684 13.25 16.1123 12.5746 16.1717 12.3339C16.1854 12.2783 16.1974 12.2232 16.2098 12.1673C16.2792 11.853 16.4216 10.75 15 10.75Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 10.75C7.57837 10.75 7.72077 11.853 7.79021 12.1673C7.80257 12.2232 7.81462 12.2783 7.82834 12.3339C7.8877 12.5746 8.13163 13.25 9 13.25C9.86837 13.25 10.1123 12.5746 10.1717 12.3339C10.1854 12.2783 10.1974 12.2232 10.2098 12.1673C10.2792 11.853 10.4216 10.75 9 10.75Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
