import { IconProps } from "./types";

export function WifiNoConnection({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <circle cx="12" cy="18" r="1" fill="currentColor" />
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M9.5 14.5627C10.2016 14.0516 11.0656 13.75 12 13.75C12.9344 13.75 13.7984 14.0516 14.5 14.5627"
      />
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M16.7128 11.2277C15.952 10.6973 15.0976 10.2918 14.1794 10.041M7.2876 11.2277C8.19156 10.5975 9.22762 10.1436 10.3459 9.91602"
      />
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M4.75 8.25C6.73421 6.86597 9 5.75 12 5.75C12.6875 5.75 13.3364 5.8086 13.9522 5.9156M19.25 8.25C18.6425 7.82628 18.0087 7.42768 17.3354 7.07854"
      />
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M18.25 5.75L6.75 17.25"
      />
    </svg>
  );
}
