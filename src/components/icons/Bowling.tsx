import { IconProps } from "./types";

export function Bowling({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M15 18.772a6.752 6.752 0 0 0 0-12.544m-.75 3.022v.01m1 1.99v.01m-7.809-1.01h3.118m.73 9 .888-1.103c1.461-1.814 1.427-4.313-.084-6.091L10.346 10l.566-3.154C11.11 5.75 10.198 4.75 9 4.75s-2.11.999-1.913 2.096L7.654 10l-1.747 2.056c-1.51 1.778-1.545 4.277-.084 6.091l.888 1.103h4.578Z"
      />
    </svg>
  );
}
