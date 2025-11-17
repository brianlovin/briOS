import { IconProps } from "./types";

export function ChemicalTube({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M16.25 4.75H7.75L8.73964 5.86334C9.39049 6.59555 9.75 7.54114 9.75 8.5208V11.25L4.75 19.25H19.25L14.25 11.25V8.5208C14.25 7.54114 14.6095 6.59555 15.2604 5.86334L16.25 4.75Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7 15.75H17"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
