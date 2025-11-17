import { IconProps } from "./types";

export function Building01({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M13.25 19.25H5.75C5.19772 19.25 4.75 18.8023 4.75 18.25V10.4852C4.75 10.0106 4.91876 9.55146 5.22612 9.18986L9 4.75L12.7739 9.18986C13.0812 9.55146 13.25 10.0106 13.25 10.4852V13M13.25 19.25V13M13.25 19.25H18.25C18.8023 19.25 19.25 18.8023 19.25 18.25V13H13.25M10.25 11C10.25 11.6904 9.69036 12.25 9 12.25C8.30964 12.25 7.75 11.6904 7.75 11C7.75 10.3096 8.30964 9.75 9 9.75C9.69036 9.75 10.25 10.3096 10.25 11Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
