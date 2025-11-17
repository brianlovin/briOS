import { IconProps } from "./types";

export function Seeds({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M13.57 13.57c-1.074 1.074-1.096 2.793-.05 3.839 1.046 1.046 4.28 2.539 5.354 1.465 1.074-1.074-.419-4.308-1.465-5.354-1.046-1.046-2.765-1.024-3.838.05Zm0 0 1.768 1.768.177 1.238M5.57 10.424c-1.073-1.073-1.096-2.792-.05-3.838C6.566 5.54 9.8 4.047 10.874 5.121c1.074 1.074-.419 4.308-1.465 5.354-1.046 1.046-2.765 1.024-3.839-.05Zm0 0 1.768-1.767.177-1.238M19.25 5.25v.01m-4 2.99v.01m4 1.99v.01m-14.5 3.99v.01m5-.01v.01m-.5 4.99v.01"
      />
    </svg>
  );
}
