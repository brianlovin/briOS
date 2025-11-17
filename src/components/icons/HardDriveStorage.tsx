import { IconProps } from "./types";

export function HardDriveStorage({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M12 4.75a7.25 7.25 0 1 0 5.214 2.213M12 4.75c2.047 0 3.896.848 5.214 2.213M12 4.75v5m0 0a2.25 2.25 0 1 0 1.677.75M12 9.75c.666 0 1.265.29 1.677.75m0 0 3.537-3.537"
      />
    </svg>
  );
}
