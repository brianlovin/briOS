import { IconProps } from "./types";

export function Onion({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M12 16.75c-.69 0-1.25.672-1.25 1.5V19M12 16.75c.69 0 1.25.672 1.25 1.5V19M12 16.75v-2m1.083 2.75c2.26-.929 2.83-6.286-.333-6.75m-1.62 6.422S8.75 16 8.75 13m9.5 0a6.25 6.25 0 1 1-12.5 0C5.75 9 12 8 12 4.75 12 8 18.25 9 18.25 13Z"
      />
    </svg>
  );
}
