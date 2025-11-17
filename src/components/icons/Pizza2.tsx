import { IconProps } from "./types";

export function Pizza2({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M19.25 12C19.25 16.0041 16.0041 19.25 12 19.25C7.99594 19.25 4.75 16.0041 4.75 12C4.75 7.99594 7.99594 4.75 12 4.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.5 10C9.5 10.2761 9.27614 10.5 9 10.5C8.72386 10.5 8.5 10.2761 8.5 10C8.5 9.72386 8.72386 9.5 9 9.5C9.27614 9.5 9.5 9.72386 9.5 10Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.5 15C11.5 15.2761 11.2761 15.5 11 15.5C10.7239 15.5 10.5 15.2761 10.5 15C10.5 14.7239 10.7239 14.5 11 14.5C11.2761 14.5 11.5 14.7239 11.5 15Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16.5 14C16.5 14.2761 16.2761 14.5 16 14.5C15.7239 14.5 15.5 14.2761 15.5 14C15.5 13.7239 15.7239 13.5 16 13.5C16.2761 13.5 16.5 13.7239 16.5 14Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14 10L13.2632 9.85967C13.2168 10.1036 13.2941 10.3547 13.4697 10.5303C13.6453 10.7059 13.8964 10.7832 14.1403 10.7368L14 10ZM15 4.75V4C14.6399 4 14.3306 4.25593 14.2632 4.60967L15 4.75ZM19.25 9L19.3903 9.73675C19.7441 9.66937 20 9.3601 20 9H19.25ZM14.7368 10.1403L15.7368 4.89033L14.2632 4.60967L13.2632 9.85967L14.7368 10.1403ZM19.1097 8.26325L13.8597 9.26325L14.1403 10.7368L19.3903 9.73675L19.1097 8.26325ZM15 5.5H15.25V4H15V5.5ZM18.5 8.75V9H20V8.75H18.5ZM15.25 5.5C17.0449 5.5 18.5 6.95507 18.5 8.75H20C20 6.12665 17.8734 4 15.25 4V5.5Z"
        fill="currentColor"
      />
    </svg>
  );
}
