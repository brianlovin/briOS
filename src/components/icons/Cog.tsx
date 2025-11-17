import { IconProps } from "./types";

export function Cog({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M12 5.5v-.75m3.25 1.62.375-.649m2.004 3.03.65-.376M13.5 12h5.75m-1.62 3.25.649.375m-3.03 2.004.376.65M12 19.25v-.5m-3.625-.471.25-.433 2.61-4.784M5.72 15.626l.433-.25M4.75 12h.5m.471-3.625.433.25m2.221-2.904.25.433 2.62 4.416M18.25 12a6.25 6.25 0 1 1-12.5 0 6.25 6.25 0 0 1 12.5 0Zm-5 0a1.25 1.25 0 1 1-2.5 0 1.25 1.25 0 0 1 2.5 0Z"
      />
    </svg>
  );
}
