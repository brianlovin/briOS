import { IconProps } from "./types";

export function Tag2({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="m10.25 10.25-5.5-5.5m2 3.071v4.223c0 .284.113.556.314.757l5.821 5.822a2.142 2.142 0 0 0 3.03 0l2.708-2.709a2.142 2.142 0 0 0 0-3.029L12.8 7.064a1.069 1.069 0 0 0-.757-.314H7.82c-.592 0-1.071.48-1.071 1.071Z"
      />
    </svg>
  );
}
