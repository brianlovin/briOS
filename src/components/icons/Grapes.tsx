import { IconProps } from "./types";

export function Grapes({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M8.89 18.22a2.25 2.25 0 1 1-3.222-3.034m2.138.314A2.25 2.25 0 1 0 9.5 13.806m-2.155-3.03a2.25 2.25 0 1 0 1.885 2.53m6.964.194a2.25 2.25 0 0 1-4.444-.5v-.5M14 9s2-4 5.25-4.25M9.75 8a2.25 2.25 0 1 1 2.564 2.228M12.25 11a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm6 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
      />
    </svg>
  );
}
