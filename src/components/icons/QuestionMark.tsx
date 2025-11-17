import { IconProps } from "./types";

export function QuestionMark({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M8.249 7a4.25 4.25 0 1 1 5.678 5.789C12.943 13.29 12 14.145 12 15.25M12 19v.25"
      />
    </svg>
  );
}
