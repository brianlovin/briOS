import { IconProps } from "./types";

export function Rollercoaster({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M4.75 12.5C4.33579 12.5 4 12.8358 4 13.25C4 13.6642 4.33579 14 4.75 14V12.5ZM19.25 14C19.6642 14 20 13.6642 20 13.25C20 12.8358 19.6642 12.5 19.25 12.5V14ZM4.75 14C5.85213 14 6.53967 13.3672 7.00641 12.6391C7.23333 12.2851 7.42373 11.8874 7.59703 11.4989C7.78184 11.0847 7.92992 10.7228 8.11847 10.3143C8.48217 9.52627 8.88113 8.83403 9.45995 8.33239C10.0154 7.85098 10.7899 7.5 12 7.5V6C10.4601 6 9.32833 6.46152 8.47755 7.19886C7.65012 7.91597 7.14283 8.84873 6.75653 9.68571C6.57008 10.0897 6.38222 10.5403 6.22719 10.8878C6.06065 11.2611 5.9073 11.5742 5.74359 11.8296C5.42908 12.3203 5.14787 12.5 4.75 12.5V14ZM12 7.5C13.2101 7.5 13.9846 7.85098 14.5401 8.33239C15.1189 8.83403 15.5178 9.52627 15.8815 10.3143C16.0701 10.7228 16.2182 11.0847 16.403 11.4989C16.5763 11.8874 16.7667 12.2851 16.9936 12.6391C17.4603 13.3672 18.1479 14 19.25 14V12.5C18.8521 12.5 18.5709 12.3203 18.2564 11.8296C18.0927 11.5742 17.9394 11.2611 17.7728 10.8878C17.6178 10.5403 17.4299 10.0897 17.2435 9.68571C16.8572 8.84873 16.3499 7.91597 15.5224 7.19886C14.6717 6.46152 13.5399 6 12 6V7.5Z"
        fill="currentColor"
      />
      <path
        d="M4.75 13.5V19.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.75 9.5V19.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.75 7V19.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.75 7.28125V19.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16.75 10.5V19.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19.25 13.2812V19.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
