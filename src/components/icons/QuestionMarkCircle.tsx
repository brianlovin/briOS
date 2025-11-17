import { IconProps } from "./types";

export function QuestionMarkCircle({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M9.984 9A2.248 2.248 0 0 1 12 7.75a2.25 2.25 0 0 1 1.579 3.853c-.5.493-1.108 1.025-1.402 1.65M12 16.25v.01m0 2.99a7.25 7.25 0 1 1 0-14.5 7.25 7.25 0 0 1 0 14.5Z"
      />
    </svg>
  );
}
