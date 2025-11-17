import { IconProps } from "./types";

export function PencilBook({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M7.25 4.75V19.25M12.25 4.75H5.75C5.19772 4.75 4.75 5.19771 4.75 5.75V18.25C4.75 18.8023 5.19772 19.25 5.75 19.25H13.25M14.75 16.25V6.75C14.75 5.64543 15.6454 4.75 16.75 4.75H17.25C18.3546 4.75 19.25 5.64543 19.25 6.75V16.25L17 19.25L14.75 16.25Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
