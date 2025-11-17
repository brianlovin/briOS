import { IconProps } from "./types";

export function Photoshop({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M4.75 7.75C4.75 6.09315 6.09315 4.75 7.75 4.75H16.25C17.9069 4.75 19.25 6.09315 19.25 7.75V16.25C19.25 17.9069 17.9069 19.25 16.25 19.25H7.75C6.09315 19.25 4.75 17.9069 4.75 16.25V7.75Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.7545 16.25H14.3483C14.9986 16.25 15.3927 15.6053 15.1985 15.0557C15.1227 14.841 14.8972 14.7345 14.6727 14.6965L13.3514 14.473C13.1269 14.4351 12.9039 14.3285 12.8193 14.117C12.5713 13.4973 13.0132 12.75 13.752 12.75H15.2545"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.75 16.25V12.25M7.75 12.25V8.75H9.5C10.4665 8.75 11.25 9.5335 11.25 10.5C11.25 11.4665 10.4665 12.25 9.5 12.25H7.75Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
