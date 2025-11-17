import { IconProps } from "./types";

export function Cards({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M14.25 4.75H5.75C5.19772 4.75 4.75 5.19771 4.75 5.75V18.25C4.75 18.8023 5.19772 19.25 5.75 19.25H14.25C14.8023 19.25 15.25 18.8023 15.25 18.25V5.75C15.25 5.19772 14.8023 4.75 14.25 4.75Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17.75 4.75H18.25C18.8023 4.75 19.25 5.19772 19.25 5.75V18.25C19.25 18.8023 18.8023 19.25 18.25 19.25H17.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
