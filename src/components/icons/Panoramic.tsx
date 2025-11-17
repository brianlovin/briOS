import { IconProps } from "./types";

export function Panoramic({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M12 8.16667C7.06853 8.16667 4.75 7 4.75 7V17.5C4.75 17.5 7.06853 16.3333 12 16.3333C16.9315 16.3333 19.25 17.5 19.25 17.5V7C19.25 7 16.9315 8.16667 12 8.16667Z"
        stroke="#141414"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
