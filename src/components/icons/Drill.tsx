import { IconProps } from "./types";

export function Drill({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M4.75 5.75C4.75 5.19772 5.19772 4.75 5.75 4.75H14.25V11.25H5.75C5.19772 11.25 4.75 10.8023 4.75 10.25V5.75Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.25 11.5L11.3626 18.378C11.2982 18.8766 10.8736 19.25 10.3708 19.25H7.88736C7.28427 19.25 6.81841 18.7202 6.89559 18.122L7.75004 11.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.25 4.75L17.25 6.75V9.25L14.25 11.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17.5 8H19.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
