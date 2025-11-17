import { IconProps } from "./types";

export function CursorDottedLine({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M4.75 6.25V5.75C4.75 5.19772 5.19772 4.75 5.75 4.75H6.25M8.75 4.75H9.25M4.75 15.25V14.75M4.75 12.25V11.75M4.75 9.25V8.75M11.75 4.75H12.25M14.75 4.75H15.25M19.25 6.25V5.75C19.25 5.19772 18.8023 4.75 18.25 4.75H17.75M4.75 17.75V18.25C4.75 18.8023 5.19772 19.25 5.75 19.25H6.25M14.1905 19.25L10.75 10.75L19.25 14.1905L15.2024 15.2024L14.1905 19.25Z"
        stroke="#141414"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
