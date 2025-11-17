import { IconProps } from "./types";

export function AppDissection({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M7 10C5.89543 10 5 10.8954 5 12V17.5C5 18.6046 5.89543 19.5 7 19.5H12.5C13.6046 19.5 14.5 18.6046 14.5 17.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18.6972 12.9167L19.5728 7.48683C19.7486 6.39632 19.0072 5.36979 17.9167 5.19395L12.4868 4.31839C11.3963 4.14254 10.3698 4.88398 10.194 5.97449L9.31839 11.4044C9.14254 12.4949 9.88398 13.5214 10.9745 13.6972L16.4044 14.5728C17.4949 14.7486 18.5214 14.0072 18.6972 12.9167Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
