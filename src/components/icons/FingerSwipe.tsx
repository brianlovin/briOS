import { IconProps } from "./types";

export function FingerSwipe({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M11.8126 11.25L12.1584 6.11199C12.208 5.37505 11.6236 4.75 10.885 4.75C10.2378 4.75 9.6931 5.23441 9.61748 5.87716L8.75009 13.25L7.14633 11.3273C6.53444 10.5937 5.42116 10.5538 4.75822 11.2416C4.75328 11.2467 4.75182 11.2543 4.7545 11.2609L6.73335 16.1319C7.49918 18.017 9.33096 19.25 11.3657 19.25H15.2501C17.4592 19.25 19.2501 17.4591 19.2501 15.25V14.25C19.2501 12.5931 17.9069 11.25 16.2501 11.25H11.8126Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5 6.99998C5 6.99998 5.35 6.52976 6.25 6.17175M15.7656 5.74988C17.8443 6.34246 19.25 7.24988 19.25 7.24988"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
