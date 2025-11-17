import { IconProps } from "./types";

export function IceCream({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M12 16.5V19.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16.2417 8.73179C15.8633 8.90404 15.4429 9 15 9C13.3431 9 12 7.65685 12 6C12 5.55714 12.096 5.1367 12.2682 4.75833C12.1795 4.7528 12.0901 4.75 12 4.75C9.65279 4.75 7.75 6.65279 7.75 9V15.25C7.75 15.8023 8.19772 16.25 8.75 16.25H15.25C15.8023 16.25 16.25 15.8023 16.25 15.25V9C16.25 8.90991 16.2472 8.82048 16.2417 8.73179Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
