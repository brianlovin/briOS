import { IconProps } from "./types";

export function Spoon({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M14.25 7.5C14.25 9.01878 13.2426 10.25 12 10.25C10.7574 10.25 9.75 9.01878 9.75 7.5C9.75 5.98122 10.7574 4.75 12 4.75C13.2426 4.75 14.25 5.98122 14.25 7.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 10.5V19.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
