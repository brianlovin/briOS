import { IconProps } from "./types";

export function Dna2({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M7 19.25C7 19.6642 7.33579 20 7.75 20C8.16421 20 8.5 19.6642 8.5 19.25H7ZM9.69276 10.4988L9.23418 9.90531L9.23418 9.90531L9.69276 10.4988ZM13.7086 8.34346C14.0363 8.09019 14.0967 7.61918 13.8435 7.29141C13.5902 6.96365 13.1192 6.90327 12.7914 7.15654L13.7086 8.34346ZM8.5 19.25V14.4552H7V19.25H8.5ZM10.1513 11.0922L13.7086 8.34346L12.7914 7.15654L9.23418 9.90531L10.1513 11.0922ZM8.5 14.4552C8.5 13.139 9.10984 11.897 10.1513 11.0922L9.23418 9.90531C7.82508 10.9942 7 12.6744 7 14.4552H8.5Z"
        fill="currentColor"
      />
      <path
        d="M17 4.75C17 4.33579 16.6642 4 16.25 4C15.8358 4 15.5 4.33579 15.5 4.75H17ZM14.3072 13.5012L13.8487 12.9078L13.8487 12.9078L14.3072 13.5012ZM10.2914 15.6565C9.96365 15.9098 9.90327 16.3808 10.1565 16.7086C10.4098 17.0363 10.8808 17.0967 11.2086 16.8435L10.2914 15.6565ZM15.5 4.75V9.5448H17V4.75H15.5ZM13.8487 12.9078L10.2914 15.6565L11.2086 16.8435L14.7658 14.0947L13.8487 12.9078ZM15.5 9.5448C15.5 10.861 14.8902 12.103 13.8487 12.9078L14.7658 14.0947C16.1749 13.0058 17 11.3256 17 9.5448H15.5Z"
        fill="currentColor"
      />
      <path
        d="M11 10L14 13.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.5 16L4.75 17.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16.5 8L19.25 6.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
