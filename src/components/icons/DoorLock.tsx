import { IconProps } from "./types";

export function DoorLock({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M12.75 13.75V18.25C12.75 18.8023 13.1977 19.25 13.75 19.25H18.25C18.8023 19.25 19.25 18.8023 19.25 18.25V13.75H12.75Z"
        stroke="#currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14 13.5V12C14 10.8954 14.8954 10 16 10C17.1046 10 18 10.8954 18 12V13.5"
        stroke="#currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 12V12.01"
        stroke="#currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.25 7.25V4.75H4.75V19.25H9.25"
        stroke="#currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
