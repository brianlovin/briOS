import { IconProps } from "./types";

export function Spotify({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M19.0931 13.5003C18.2645 17.4177 14.4171 19.9217 10.4997 19.0931C6.58231 18.2645 4.07835 14.4171 4.90695 10.4997C5.73555 6.58231 9.58294 4.07835 13.5003 4.90695C17.4177 5.73555 19.9217 9.58294 19.0931 13.5003Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.3894 8.63697C9.3894 8.63697 10.5528 8.37197 12.6725 8.82034C14.7923 9.26871 15.7487 9.98208 15.7487 9.98208M9.74694 11.779C9.74694 11.779 10.7371 11.4773 12.0517 11.7554C13.3664 12.0335 14.1495 12.7102 14.1495 12.7102M10.3411 14.5728C10.6619 14.575 11.0314 14.606 11.4309 14.6905C11.8303 14.775 12.1807 14.8962 12.4749 15.0242"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
