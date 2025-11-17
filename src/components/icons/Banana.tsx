import { IconProps } from "./types";

export function Banana({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M11.75 11.25s1.123-2.579 1.782-4.563C13.88 5.64 14.895 4.75 16 4.75s2.013.898 1.894 1.996c-.168 1.557-.594 3.454-1.644 4.504m-4.5 0h4.5m-4.5 0s-1.778 3.754-5.51 4.588c-.809.18-1.49.662-1.49 2.162 0 1.25 1.5 1.25 1.5 1.25s0 0 0 0c6.438 0 8.25-5.25 8.25-5.25m-2.75-2.75L14.5 14m1.75-2.75c.583.333 2 .75 2 2.75S17 17.25 17 17.25L14.5 14M12 10.75c-1.2-1.2-2-4-2-4C7.5 9 10 13.5 10 13.5"
      />
    </svg>
  );
}
