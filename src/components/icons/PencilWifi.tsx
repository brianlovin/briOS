import { IconProps } from "./types";

export function PencilWifi({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M4.75 6.22c1.795-1.96 4.705-1.96 6.5 0M6.607 8.25c.77-.84 2.017-.84 2.786 0m1.09 10.122-3.733.878.879-3.734 8.175-8.175a2.019 2.019 0 0 1 2.855 2.856l-8.175 8.175Z"
      />
    </svg>
  );
}
