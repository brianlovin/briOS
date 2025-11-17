import { IconProps } from "./types";

export function Filters({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M4.75 7C4.33579 7 4 7.33579 4 7.75C4 8.16421 4.33579 8.5 4.75 8.5V7ZM19.25 8.5C19.6642 8.5 20 8.16421 20 7.75C20 7.33579 19.6642 7 19.25 7V8.5ZM4.75 8.5H19.25V7H4.75V8.5Z"
        fill="currentColor"
      />
      <path
        d="M6.75 11C6.33579 11 6 11.3358 6 11.75C6 12.1642 6.33579 12.5 6.75 12.5V11ZM17.25 12.5C17.6642 12.5 18 12.1642 18 11.75C18 11.3358 17.6642 11 17.25 11V12.5ZM6.75 12.5H17.25V11H6.75V12.5Z"
        fill="currentColor"
      />
      <path
        d="M8.75 15C8.33579 15 8 15.3358 8 15.75C8 16.1642 8.33579 16.5 8.75 16.5V15ZM15.25 16.5C15.6642 16.5 16 16.1642 16 15.75C16 15.3358 15.6642 15 15.25 15V16.5ZM8.75 16.5H15.25V15H8.75V16.5Z"
        fill="currentColor"
      />
    </svg>
  );
}
