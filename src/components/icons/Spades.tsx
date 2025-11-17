import { IconProps } from "./types";

export function Spades({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M6.17605 11.4825C5.18136 13.1568 5.98772 15.1927 7.97711 16.0298C9.23515 16.5592 9.40934 16.3841 10.25 15.75L8.75 19.25H15.25L13.75 15.75C14.5907 16.3841 14.7649 16.5592 16.0229 16.0298C18.0123 15.1927 18.8186 13.1568 17.8239 11.4825C16.8292 9.80828 12 4.75 12 4.75C12 4.75 7.17075 9.80828 6.17605 11.4825Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
