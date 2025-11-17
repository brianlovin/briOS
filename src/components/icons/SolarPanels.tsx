import { IconProps } from "./types";

export function SolarPanels({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M12 12.75H6.75l-1 3m6.25-3h5.25l1 3m-6.25-3v3m0 3.5h7.25l-1-3.5M12 19.25H4.75l1-3.5m6.25 3.5v-3.5m0 0H5.75m6.25 0h6.25m-10.5-5.5h.75a.25.25 0 0 0 .25-.25 3.25 3.25 0 0 1 6.5 0c0 .138.112.25.25.25h.75M12 4.75V6.5m-3.25.25.752.752m5.748-.752-.75.75"
      />
    </svg>
  );
}
