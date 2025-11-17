import { IconProps } from "./types";

export function TwoHearts({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M9.497 10.877c-.95-1.233-2.534-1.565-3.724-.436-1.19 1.13-1.357 3.019-.423 4.355l4.147 4.454 4.146-4.454c.934-1.336.787-3.237-.423-4.355-1.21-1.117-2.774-.797-3.723.436Zm7.501-5.593c-.45-.584-1.2-.742-1.763-.207a1.606 1.606 0 0 0-.2 2.063l1.963 2.11 1.964-2.11c.443-.633.373-1.533-.2-2.063-.573-.529-1.314-.377-1.764.207Z"
        clipRule="evenodd"
      />
    </svg>
  );
}
