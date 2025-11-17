import { IconProps } from "./types";

export function Ghost({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M5.75 11V18.6671C5.75 19.1739 6.35441 19.4368 6.72519 19.0913L7.43088 18.4337C8.06762 17.8404 9.0151 17.7272 9.77366 18.1539L11.5097 19.1305C11.8142 19.3017 12.1858 19.3017 12.4903 19.1305L14.2263 18.1539C14.9849 17.7272 15.9324 17.8404 16.5691 18.4337L17.2748 19.0913C17.6456 19.4368 18.25 19.1739 18.25 18.6671V11C18.25 7.54822 15.4518 4.75 12 4.75C8.54822 4.75 5.75 7.54822 5.75 11Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.5 10C10.5 10.2761 10.2761 10.5 10 10.5C9.72386 10.5 9.5 10.2761 9.5 10C9.5 9.72386 9.72386 9.5 10 9.5C10.2761 9.5 10.5 9.72386 10.5 10Z"
        stroke="currentColor"
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
