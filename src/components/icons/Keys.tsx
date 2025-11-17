import { IconProps } from "./types";

export function Keys({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M10.25 13.0632C11.9872 12.5294 13.25 10.9122 13.25 9C13.25 6.65279 11.3472 4.75 9 4.75C6.65279 4.75 4.75 6.65279 4.75 9C4.75 10.9122 6.01283 12.5294 7.75 13.0632V18C7.75 18.6904 8.30964 19.25 9 19.25C9.69036 19.25 10.25 18.6904 10.25 18V13.0632Z"
        stroke="#currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 12L17.3452 15.0736C17.9523 15.436 18.7285 15.2209 19.079 14.5932C19.4295 13.9655 19.2215 13.1629 18.6144 12.8005L13.5 9.5"
        stroke="#currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 8V8.01"
        stroke="#currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
