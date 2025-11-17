import { IconProps } from "./types";

export function UsersMinus({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M19.25 17H15.75M11.25 19.25H5.78165C5.21714 19.25 4.77296 18.7817 4.88545 18.2285C5.19601 16.7012 6.21027 14 9.49996 14C10.1744 14 10.7532 14.0563 11.25 14.25M14.75 10.25C16.2687 10.25 17.25 9.01878 17.25 7.5C17.25 5.98122 16.2687 4.75 14.75 4.75M12.25 7.5C12.25 9.01878 11.0187 10.25 9.49996 10.25C7.98118 10.25 6.74996 9.01878 6.74996 7.5C6.74996 5.98122 7.98118 4.75 9.49996 4.75C11.0187 4.75 12.25 5.98122 12.25 7.5Z"
      />
    </svg>
  );
}
