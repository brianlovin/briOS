import { IconProps } from "./types";

export function Satellite2({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M9 11.25L5.75 8L9 4.75L12.25 8M16 11.75L19.25 15L16 18.25L12.75 15M6.75 17.25L4.75 19.25M15.832 4.75L8.75 11.832L12.168 15.25L19.25 8.16799L15.832 4.75ZM5.91667 13.8611L4.75 15.0278L8.97222 19.25L10.1389 18.0833C11.3048 16.9174 11.3048 15.027 10.1389 13.8611C8.97295 12.6952 7.0826 12.6952 5.91667 13.8611Z"
        stroke="#141414"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
