import { IconProps } from "./types";

export function Dog({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M19.25 12.25C19.25 12.25 16.3 10.4 15.5 8C14.7 5.6 12.75 4.75 12.75 4.75V8M12.75 8V10.25M12.75 8C12.75 8 9.5 9 8 10C6.92346 10.7177 5.71814 11.208 5.1234 11.9923C4.87546 12.3192 4.75 12.7201 4.75 13.1304V15.19C4.75 16.2175 5.52729 17.0797 6.54331 17.2329C8.61964 17.5459 11.9239 18.1892 13.25 19.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.5 12C10.5 12.2761 10.2761 12.5 10 12.5C9.72386 12.5 9.5 12.2761 9.5 12C9.5 11.7239 9.72386 11.5 10 11.5C10.2761 11.5 10.5 11.7239 10.5 12Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
