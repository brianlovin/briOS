import { IconProps } from "./types";

export function SideProfile({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M8.75 19.25V16C7.37501 14.8535 5.75 12.9302 5.75 11C5.75 7.54822 8.54822 4.75 12 4.75C15.4518 4.75 18.25 7.54822 18.25 11V14.25C18.25 15.3546 17.3546 16.25 16.25 16.25H14.25V19.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.5 10C14.5 10.2761 14.2761 10.5 14 10.5C13.7239 10.5 13.5 10.2761 13.5 10C13.5 9.72386 13.7239 9.5 14 9.5C14.2761 9.5 14.5 9.72386 14.5 10Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
