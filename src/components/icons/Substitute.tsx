import { IconProps } from "./types";

export function Substitute({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M14.75 6H18.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19.25 11H15.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17.75 4.75L19.25 6L17.75 7.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16.25 12.25L14.75 11L16.25 9.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.25 8C12.25 9.24264 11.2426 10.25 10 10.25C8.75736 10.25 7.75 9.24264 7.75 8C7.75 6.75736 8.75736 5.75 10 5.75C11.2426 5.75 12.25 6.75736 12.25 8Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.21168 18.25H13.7883C14.6279 18.25 15.2746 17.0649 14.8825 16.1032C14.3058 14.6886 12.9909 12.75 10 12.75C7.00905 12.75 5.69419 14.6886 5.11745 16.1032C4.72537 17.0649 5.3721 18.25 6.21168 18.25Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
