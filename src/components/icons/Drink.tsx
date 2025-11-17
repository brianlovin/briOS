import { IconProps } from "./types";

export function Drink({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M7.63091 18.3866L5.90677 5.88664C5.82389 5.28572 6.29079 4.75 6.89739 4.75H17.1026C17.7092 4.75 18.1761 5.28572 18.0932 5.88664L16.3691 18.3866C16.3008 18.8814 15.8779 19.25 15.3785 19.25H8.62153C8.12205 19.25 7.69916 18.8814 7.63091 18.3866Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7 12C7 12 9 9.99998 12 12C15 14 17 12 17 12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
