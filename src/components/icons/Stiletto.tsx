import { IconProps } from "./types";

export function Stiletto({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="m8.25 10.939 4.454 6.856a1 1 0 0 0 .839.455h5.707v-1.567c0-1.73-1.349-3.133-3.006-3.133-1.27 0-2.46-.629-3.21-1.68-.145-.203-.287-.41-.451-.597L9.25 7.456 6.197 5.862c-.665-.348-1.447.157-1.447.934v4.143m3.5 0h-3.5m3.5 0v6.267c0 .576-.448 1.044-1 1.044h-.633c-.497 0-.92-.382-.99-.897L4.75 10.94"
      />
    </svg>
  );
}
