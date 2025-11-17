import { IconProps } from "./types";

export function VisionPro({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M12 8C9.50309 8 7.84223 8.34307 6.74868 8.75352C5.23868 9.32028 4.75 10.9837 4.75 12.6332V13.3572C4.75 15.0929 6.12162 16.5 7.8136 16.5H9.07056C9.61993 16.5 10.1468 16.2761 10.5353 15.8776C11.3442 15.0477 12.6558 15.0477 13.4647 15.8776C13.8532 16.2761 14.3801 16.5 14.9294 16.5H16.1864C17.8784 16.5 19.25 15.0929 19.25 13.3572V12.6332C19.25 10.9837 18.7613 9.32028 17.2513 8.75352C16.1578 8.34307 14.4969 8 12 8Z"
        stroke="#141414"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
