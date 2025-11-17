import { IconProps } from "./types";

export function Feather({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M4.75 19.25L15.25 8.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.68629 17.25H6.75V15.3137C6.75 13.192 7.59285 11.1571 9.09315 9.65686L11.6569 7.09315C13.1571 5.59285 15.192 4.75 17.3137 4.75H19.25V6.68629C19.25 8.80802 18.4071 10.8429 16.9069 12.3431L14.3431 14.9069C12.8429 16.4071 10.808 17.25 8.68629 17.25Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
