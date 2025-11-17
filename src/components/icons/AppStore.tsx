import { IconProps } from "./types";

export function AppStore({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M14.05 13.25H15.25M8.75 13.25H9.95M9.95 13.25H11.25M9.95 13.25L8.75 15.25M9.95 13.25L12 9.83333M12 9.83333L13.25 7.75M12 9.83333L15.25 15.25M12 9.83333L10.75 7.75M19.25 12C19.25 16.0041 16.0041 19.25 12 19.25C7.99594 19.25 4.75 16.0041 4.75 12C4.75 7.99594 7.99594 4.75 12 4.75C16.0041 4.75 19.25 7.99594 19.25 12Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
