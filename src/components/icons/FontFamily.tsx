import { IconProps } from "./types";

export function FontFamily({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M9.18499 8.21222C9.39366 10.133 9.92753 12.2519 10.096 14.1153M10.096 14.1153C10.2987 16.3564 9.97291 18.228 7.91753 18.9409C6.62545 19.3891 5.0788 18.5064 5.26597 17.1516C5.35941 16.4753 5.72812 15.7801 6.59494 15.2283C6.85573 15.0623 7.14943 14.9572 7.44667 14.8723L10.096 14.1153ZM10.096 14.1153L13.9999 13"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19.25 4.75C15.5 10.25 8 4 4.75 11.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
