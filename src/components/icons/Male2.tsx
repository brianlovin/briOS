import { IconProps } from "./types";

export function Male2({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M5.75 19.25v-.509a2 2 0 0 1 1.588-1.957l1.521-.32a1.752 1.752 0 0 0 1.391-1.714m8 4.5v-.509a2 2 0 0 0-1.588-1.957l-1.521-.32a1.751 1.751 0 0 1-1.391-1.714m-3.905-.467c-1.255-1.27-2.23-3.138-2.08-4.947C7.977 6.808 9.035 4.75 12 4.75c2.963 0 4.022 2.058 4.233 4.586.156 1.865-.706 3.792-2.017 5.062-1.234 1.197-3.161 1.109-4.37-.115Z"
      />
    </svg>
  );
}
