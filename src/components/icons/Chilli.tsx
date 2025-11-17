import { IconProps } from "./types";

export function Chilli({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M19.25 8.75c0 1.936-1.309 2.394-1.309 2.394m.939 1.205c-.144-.332-.403-.669-.706-.986-1.13-1.181-2.93-1.213-4.46-.638-1.617.606-1.214 1.272-4.78 1.272-2.078 0-4.157.874-4.157.874-.174 1.124.415 2.373 4.157 2.373 3.598 0 5.884.23 9.61-2.082.286-.178.47-.504.336-.813Z"
      />
    </svg>
  );
}
