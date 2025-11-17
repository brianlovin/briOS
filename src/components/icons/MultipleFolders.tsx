import { IconProps } from "./types";

export function MultipleFolders({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M4.75 10.75V17.25C4.75 18.3546 5.64543 19.25 6.75 19.25H14.25C15.3546 19.25 16.25 18.3546 16.25 17.25V12.75C16.25 11.6454 15.3546 10.75 14.25 10.75H4.75ZM4.75 10.75V9.75C4.75 8.64543 5.64543 7.75 6.75 7.75H9.81273C10.5446 7.75 11.2181 8.14977 11.5685 8.7923L12.6406 10.75M7.75 7.75V6.75C7.75 5.64543 8.64543 4.75 9.75 4.75H12.8127C13.5446 4.75 14.2181 5.14977 14.5685 5.7923L15.6406 7.75H17.25C18.3546 7.75 19.25 8.64543 19.25 9.75V14.25C19.25 15.3546 18.3546 16.25 17.25 16.25H16.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
