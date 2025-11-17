import { IconProps } from "./types";

export function SnowMobile({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M15.107 6.75h.73a2 2 0 0 1 1.885 1.332l.285.804m0 0 1.243 2.091v2.273l-2.071 1H15.75m2.257-5.364-2.9 2.091L11.25 8.75h-6.5v.956a3 3 0 0 0 2.214 2.895L8 12.882m5.036 1.368-1.177 1.705A3 3 0 0 1 9.39 17.25H5.77c-.978 0-1.374-1.26-.572-1.82L8 12.883m5.036 1.367h2.714m-2.714 0L8 12.883m7.75 1.367v3h2.5"
      />
    </svg>
  );
}
