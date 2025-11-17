import { IconProps } from "./types";

export function ChefsHat({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M14.75 13.25a4.25 4.25 0 0 0 0-8.5c-.995 0-2.044.584-2.923 1.256M9 13.25a4.25 4.25 0 0 1 0-8.5c.995 0 2 .584 2.827 1.256m0 0C10.63 6.921 9.75 8 9.75 8m1 7.75v.5m2.5-.5v.5m-5.458-3-1.042 6h10.5l-1.042-6H7.792Z"
      />
    </svg>
  );
}
