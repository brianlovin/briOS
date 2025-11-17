import { IconProps } from "./types";

export function Gaming({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M9.00043 17.9394L10.3649 15.7254C10.5469 15.4299 10.8692 15.25 11.2162 15.25H12.7807C13.1289 15.25 13.4521 15.4312 13.6338 15.7282L14.978 17.926C15.7222 19.1562 17.1253 19.6479 18.2757 18.8622C18.9839 18.3786 19.3528 17.532 19.225 16.6836L18.315 10.6412C18.2336 10.1006 18.0266 9.6309 17.7343 9.2447C17.1567 8.34558 16.1482 7.75 15.0008 7.75H9.00554C7.86455 7.75 6.861 8.33891 6.2818 9.22957C5.9862 9.61688 5.77663 10.0889 5.69416 10.6328L4.77522 16.6933C4.64616 17.5446 5.01944 18.3939 5.7336 18.8739C6.87673 19.6423 8.27686 19.1875 9.00043 17.9394Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 7.5V4.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.5 12C9.5 12.2761 9.27614 12.5 9 12.5C8.72386 12.5 8.5 12.2761 8.5 12C8.5 11.7239 8.72386 11.5 9 11.5C9.27614 11.5 9.5 11.7239 9.5 12Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.5 12C15.5 12.2761 15.2761 12.5 15 12.5C14.7239 12.5 14.5 12.2761 14.5 12C14.5 11.7239 14.7239 11.5 15 11.5C15.2761 11.5 15.5 11.7239 15.5 12Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
