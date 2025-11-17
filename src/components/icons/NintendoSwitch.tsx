import { IconProps } from "./types";

export function NintendoSwitch({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M7.75 9.25v.01m8.5 4.99v.01m-11.5.99v-6.5a2 2 0 0 1 2-2h4v10.5h-4a2 2 0 0 1-2-2Zm14.5 0v-6.5a2 2 0 0 0-2-2h-4v10.5h4a2 2 0 0 0 2-2Z"
      />
    </svg>
  );
}
