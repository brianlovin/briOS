import { IconProps } from "./types";

export function Cookie({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M9 11h.01M12 12h.01m.99 3h.01m1.116-6.203h-.063L14 8.8c-2.2 0-3.984-1.81-4-4.049-3.031.885-5.25 3.732-5.25 7.108 0 4.082 3.246 7.392 7.25 7.392s7.25-3.31 7.25-7.392c0-.068 0-.136-.003-.203a3.927 3.927 0 0 1-1.247.203c-1.865 0-3.431-1.3-3.874-3.061Z"
      />
    </svg>
  );
}
