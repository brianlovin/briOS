import { IconProps } from "./types";

export function Baseball({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M19.0031 13.8764C17.9667 17.7441 13.9913 20.0393 10.1237 19.003C6.25602 17.9666 3.9608 13.9912 4.99713 10.1236C6.03346 6.25593 10.0089 3.96071 13.8765 4.99704C17.7442 6.03336 20.0394 10.0088 19.0031 13.8764Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.61926 5.78679C10.6213 9.25441 9.4332 13.6884 5.96558 15.6905"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18.0356 8.3099C14.568 10.3119 13.3799 14.746 15.382 18.2136"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
