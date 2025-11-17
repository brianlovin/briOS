import { IconProps } from "./types";

export function Padding({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M17.2502 19.25H6.75C5.64543 19.25 4.75 18.3546 4.75 17.25V6.75C4.75 5.64543 5.64543 4.75 6.75 4.75H17.2502C18.3548 4.75 19.2502 5.64543 19.2502 6.75V17.25C19.2502 18.3546 18.3548 19.25 17.2502 19.25Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.75 10.375V9.75C8.75 9.19772 9.19772 8.75 9.75 8.75H10.375M8.75 13.625V14.25C8.75 14.8023 9.19772 15.25 9.75 15.25H10.375M15.25 13.625V14.25C15.25 14.8023 14.8023 15.25 14.25 15.25H13.625M15.25 10.375V9.75C15.25 9.19772 14.8023 8.75 14.25 8.75H13.625"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
