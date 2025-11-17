import { IconProps } from "./types";

export function FryingPan({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M16.25 10.5C16.25 13.6756 13.6756 16.25 10.5 16.25C7.32436 16.25 4.75 13.6756 4.75 10.5C4.75 7.32436 7.32436 4.75 10.5 4.75C13.6756 4.75 16.25 7.32436 16.25 10.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.75 13.75L19.0618 17.945C19.3117 18.2615 19.2851 18.7149 19 19C18.7149 19.2851 18.2615 19.3117 17.945 19.0618L13.75 15.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
