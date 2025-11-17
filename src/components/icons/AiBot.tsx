import { IconProps } from "./types";

export function AiBot({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M11 4.75C7.54822 4.75 4.75 7.54822 4.75 11V14.25C4.75 15.3546 5.64543 16.25 6.75 16.25H8.75V19.25M14.25 19.25V16C15.2983 15.1259 16.492 13.8002 17 12.3642M16.0001 4.75L16.6429 6.35705L18.25 6.9999L16.6429 7.64273L16 9.25L15.3571 7.64274L13.75 6.9999L15.3573 6.35699L16.0001 4.75Z"
        stroke="#141414"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.5 10C10.5 10.2761 10.2761 10.5 10 10.5C9.72386 10.5 9.5 10.2761 9.5 10C9.5 9.72386 9.72386 9.5 10 9.5C10.2761 9.5 10.5 9.72386 10.5 10Z"
        stroke="#141414"
        strokeWidth="1.5"
      />
    </svg>
  );
}
