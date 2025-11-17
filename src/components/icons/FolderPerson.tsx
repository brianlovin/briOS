import { IconProps } from "./types";

export function FolderPerson({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M10.25 19.25H6.75C5.64543 19.25 4.75 18.3546 4.75 17.25V7.75H17.25C18.3546 7.75 19.25 8.64543 19.25 9.75V10.25M13.5 7.75L12.5685 5.7923C12.2181 5.14977 11.5446 4.75 10.8127 4.75H6.75C5.64543 4.75 4.75 5.64543 4.75 6.75V11M13.75 19.25C13.75 19.25 15 17.75 16.5 17.75C18 17.75 19.25 19.25 19.25 19.25M16.5 15.25C17.4665 15.25 18.25 14.4665 18.25 13.5C18.25 12.5335 17.4665 11.75 16.5 11.75C15.5335 11.75 14.75 12.5335 14.75 13.5C14.75 14.4665 15.5335 15.25 16.5 15.25Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
