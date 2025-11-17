import { IconProps } from "./types";

export function CatPaw({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M14.625 13.33v-.03c0-1.408-1.175-2.55-2.625-2.55s-2.625 1.142-2.625 2.55v.03c-1.484.206-2.625 1.446-2.625 2.945 0 1.643 1.371 2.975 3.063 2.975.856 0 1.631-.342 2.187-.893.556.551 1.33.893 2.188.893 1.69 0 3.062-1.332 3.062-2.975 0-1.499-1.141-2.739-2.625-2.945Z"
      />
      <circle
        cx="6"
        cy="10"
        r="1.25"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <circle
        cx="12"
        cy="6"
        r="1.25"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <circle
        cx="18"
        cy="10"
        r="1.25"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}
