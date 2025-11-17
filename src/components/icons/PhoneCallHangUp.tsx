import { IconProps } from "./types";

export function PhoneCallHangUp({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M10.9642 13.0357C9.98758 12.1045 9.41538 11.1011 9.12819 10.494C8.96724 10.1537 9.06042 9.76091 9.32658 9.49474L10.9642 7.85714L8.89275 4.75H6.0954C5.32983 4.75 4.69612 5.32802 4.71678 6.09331C4.77336 8.18879 5.32438 12.3245 8.4999 15.5M13.2968 14.8281C13.4111 14.8897 13.517 14.938 13.6116 14.9758C13.893 15.0882 14.196 14.9825 14.4102 14.7682L16.1428 13.0357L19.2499 15.1071V17.9045C19.2499 18.6701 18.6711 19.3038 17.9059 19.2831C16.324 19.2403 13.5801 18.9157 10.9642 17.3936"
      />
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M18.25 5.75L5.75 18.25"
      />
    </svg>
  );
}
