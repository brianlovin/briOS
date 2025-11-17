import { IconProps } from "./types";

export function Nordvpn({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M13.5003 5.90695C9.58294 5.07835 5.73555 7.58231 4.90695 11.4997C4.39348 13.9273 5.15975 16.5779 6.74906 18.25L9 12L10 14L12 10L17.2514 18.25C18.1488 17.3093 18.8043 15.8657 19.0931 14.5003C19.9217 10.5829 17.4177 6.73555 13.5003 5.90695Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
