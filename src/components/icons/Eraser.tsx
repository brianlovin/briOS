import { IconProps } from "./types";

export function Eraser({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M7 15.25L4.75 13L11.2929 6.45711C11.6834 6.06658 12.3166 6.06658 12.7071 6.45711L15.5429 9.29289C15.9334 9.68342 15.9334 10.3166 15.5429 10.7071L11 15.25H7Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.75 19.25H19.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
