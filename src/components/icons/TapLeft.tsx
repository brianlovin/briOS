import { IconProps } from "./types";

export function TapLeft({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentCollor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="m10 19.25-2.246-5.99a.018.018 0 0 1 .004-.018 1.605 1.605 0 0 1 2.388.086l1.604 1.922V9a1.25 1.25 0 1 1 2.5 0v4.25h2a3 3 0 0 1 3 3v3m-12-14.5L4.75 7m0 0 2.5 2.25M4.75 7h4.5"
      />
    </svg>
  );
}
