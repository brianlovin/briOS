import { IconProps } from "./types";

export function PhotoMinus({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M11.25 19.25H6.75C5.64543 19.25 4.75 18.3546 4.75 17.25V16M4.75 16V6.75C4.75 5.64543 5.64543 4.75 6.75 4.75H17.25C18.3546 4.75 19.25 5.64543 19.25 6.75V12.25L16.5856 9.50669C15.7663 8.55303 14.2815 8.51627 13.5013 9.50016L13.4914 9.51294C13.3973 9.63455 11.9522 11.5037 10.915 12.823M4.75 16L7.49619 12.5067C8.2749 11.5161 9.76453 11.5509 10.5856 12.5067L12.25 14.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19.25 17.25L15.75 17.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
