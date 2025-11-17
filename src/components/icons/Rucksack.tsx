import { IconProps } from "./types";

export function Rucksack({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M9.75 6.5V6.5C9.75 5.5335 10.5335 4.75 11.5 4.75H12.5C13.4665 4.75 14.25 5.5335 14.25 6.5V6.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.75 6.75V9.25C5.75 10.3546 6.64543 11.25 7.75 11.25H16.25C17.3546 11.25 18.25 10.3546 18.25 9.25V6.75H5.75Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.12047 10.75L4.79734 16.7618C4.51527 18.0434 5.52947 19.25 6.88881 19.25H17.1112C18.4705 19.25 19.4847 18.0434 19.2027 16.7618L17.8795 10.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 9.75V13.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
