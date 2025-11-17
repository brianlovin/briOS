import { IconProps } from "./types";

export function Giving({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M7.25 12.75H4.75V19.25H7.25V12.75Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.5 14L10.0118 12.3853C10.657 11.9705 11.4078 11.75 12.1748 11.75H13.25V14L10.75 15.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7 19C13.5 19 19.25 14.75 19.25 14.75V13H13.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14.1527 5.18934C14.6897 4.60355 15.5603 4.60355 16.0973 5.18934L16.5 5.62868L16.9027 5.18934C17.4397 4.60355 18.3103 4.60355 18.8473 5.18934C19.3842 5.77513 19.3842 6.72487 18.8473 7.31066L17.4723 8.81066C16.9353 9.39645 16.0647 9.39645 15.5277 8.81066L14.1527 7.31066C13.6158 6.72487 13.6158 5.77513 14.1527 5.18934Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
