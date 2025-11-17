import { IconProps } from "./types";

export function ShapeRotate({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M4.92904 14.8123C4.49745 13.7956 4.97182 12.6214 5.98859 12.1898L9.21035 10.8223C10.2271 10.3907 11.4012 10.8651 11.8328 11.8818L13.2004 15.1036C13.632 16.1204 13.1576 17.2945 12.1408 17.7261L8.91907 19.0936C7.90231 19.5252 6.72819 19.0508 6.2966 18.0341L4.92904 14.8123Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17.1265 17.2499C19.9578 14.4186 19.9578 9.70478 17.1265 6.87348C14.4807 4.22769 10.2988 4.05433 7.45166 6.35339"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.75 4.75V7.25H9.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
