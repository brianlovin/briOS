import { IconProps } from "./types";

export function Nuclear({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M15.25 12c0 4.004-1.455 7.25-3.25 7.25S8.75 16.004 8.75 12 10.205 4.75 12 4.75s3.25 3.246 3.25 7.25Z"
      />
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M10.184 8.78c-3.875 2.29-6.204 5.588-5.201 7.367 1.003 1.778 4.958 1.363 8.833-.927 3.876-2.29 6.204-5.588 5.201-7.367-1.003-1.778-4.958-1.363-8.833.927Z"
      />
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M13.816 8.78c3.876 2.29 6.204 5.588 5.201 7.367-1.003 1.778-4.958 1.363-8.833-.927S3.98 9.632 4.983 7.853c1.003-1.778 4.958-1.363 8.833.927Z"
      />
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12.5 12a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Z"
      />
    </svg>
  );
}
