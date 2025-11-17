import { IconProps } from "./types";

export function Ear({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentCollor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M6.75 10c0-2.761 2.489-5.25 5.25-5.25s5.25 2.489 5.25 5.25a4.55 4.55 0 0 1-.749 2.536c-.725 1.106-1.547 2.263-1.897 3.539-.403 1.467-1.178 3.175-2.604 3.175h-1.25a2 2 0 0 1-2-2v-.5m1-6.5V10a2.25 2.25 0 0 1 4.5 0v.25"
      />
    </svg>
  );
}
