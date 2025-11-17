import { IconProps } from "./types";

export function Spoon2({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M12.956 11.15c-.483-.483-.65-1.187-.733-1.865-.122-.995-.65-2.072-1.543-2.964-1.686-1.686-4.028-2.076-5.231-.872-1.204 1.203-.814 3.545.872 5.23.892.893 1.97 1.422 2.964 1.544.678.083 1.382.25 1.865.733l5.92 5.92a1.277 1.277 0 1 0 1.806-1.806l-5.92-5.92Z"
      />
    </svg>
  );
}
