import { IconProps } from "./types";

export function OrderedList({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M4.75 6.25L6.25 4.75V10.25M6.25 10.25H4.75M6.25 10.25H7.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.25 14.25H11.6562C10.9255 14.25 10.5182 13.4359 10.9058 12.8574C10.9535 12.7861 11.0211 12.7311 11.0925 12.6836L12.8924 11.486C12.9638 11.4384 13.0312 11.3832 13.0799 11.3126C13.5253 10.6678 13.0713 9.75 12.2526 9.75H10.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16.75 14.75H18.1964C19.4308 14.75 19.6499 16.6376 18.5101 16.9556C18.4549 16.971 18.397 16.9772 18.3398 16.9792L17.75 17L18.3398 17.0208C18.397 17.0228 18.4549 17.0289 18.5101 17.0444C19.6499 17.3624 19.4308 19.25 18.1964 19.25H16.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
