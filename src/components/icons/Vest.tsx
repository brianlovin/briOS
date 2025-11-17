import { IconProps } from "./types";

export function Vest({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M7.75 7.857S9.9 9.25 12 9.25s4.25-1.393 4.25-1.393m-8.5 0c-.35.518-1 1.9-1 3.143 0 1.554 1 2.446 1 4 0 1.554-.3 3.387-1 4.25h10.5c-.7-.863-1-2.696-1-4.25 0-1.554 1-2.446 1-4 0-1.243-.65-2.625-1-3.143m-8.5 0V4.75m8.5 3.107V4.75"
      />
    </svg>
  );
}
