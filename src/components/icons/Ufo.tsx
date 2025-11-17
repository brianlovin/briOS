import { IconProps } from "./types";

export function Ufo({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M6.85467 10.408C5.34979 11.5973 4.52773 12.9733 4.80246 14.1495C5.27992 16.1938 8.88944 16.8604 12.8645 15.6385C16.8396 14.4166 19.675 11.7688 19.1975 9.7246C18.9572 8.6957 17.9235 8.01578 16.449 7.75L15.9492 7.66016"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16.75 17.75L18.25 19.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.75 18.75L14.25 19.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18.75 15.75L19.25 16.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.5003 4.90074L9.97512 5.04283C7.65461 5.67062 6.27752 8.07889 6.8993 10.4218L7.04259 10.9618C7.2165 11.6171 7.71414 12.1392 8.38877 12.2068C9.22364 12.2906 10.5035 12.2886 12.0672 11.8655C13.6387 11.4404 14.7514 10.7916 15.4321 10.2967C15.9766 9.90072 16.146 9.20539 15.9733 8.55469L15.8278 8.00632C15.206 5.66336 12.8208 4.27295 10.5003 4.90074Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
