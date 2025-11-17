import { IconProps } from "./types";

export function CableCar({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="m4.75 6.25 14.5-1.5M12 6v2.5m-6.25 5.75c0 1.801.295 3.121.565 3.951.218.671.868 1.049 1.573 1.049h8.223c.706 0 1.356-.378 1.574-1.049.27-.83.565-2.15.565-3.951m-12.5 0c0-1.836.307-3.325.58-4.289.214-.752.922-1.211 1.704-1.211H12m-6.25 5.5H12m6.25 0c0-1.836-.307-3.325-.58-4.289-.214-.752-.922-1.211-1.704-1.211H12m6.25 5.5H12m0-5.5v5.5"
      />
    </svg>
  );
}
