import { IconProps } from "./types";

export function Bunting2({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="m15 10.578 4.25 1.172-3 3.5L15 10.578Zm0 0L9.875 9.164M15 10.578l-3.75 3.672-1.375-5.086m0 0L4.75 7.75 6 13l3.875-3.836Zm9.375-.914s-3.5-.5-3.5-3.5m-8.5 12V17s0 2.25-2.25 2.25h-.25"
      />
    </svg>
  );
}
