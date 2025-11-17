import { IconProps } from "./types";

export function Vase({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M17.25 17C17.25 18.2426 14.8995 19.25 12 19.25C9.10051 19.25 6.75 18.2426 6.75 17"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.75 17C6.75 13.2245 9.42264 11.0081 9.7227 8.669C9.75817 8.39252 9.71115 8.11403 9.63457 7.846L8.75 4.75H15.25L14.3654 7.846C14.2888 8.11403 14.2418 8.39252 14.2773 8.669C14.5774 11.0081 17.25 13.2245 17.25 17"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
