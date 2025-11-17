import { IconProps } from "./types";

export function FingerTap2({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M12 7.75a2.75 2.75 0 0 1 2.75 2.75v8.75M12 7.75a2.75 2.75 0 0 0-2.75 2.75v8.75M12 7.75c.685 0 1.311.25 1.793.665 1.172 1.008.516 2.778-.314 4.082a1.626 1.626 0 0 1-1.371.753h-.216a1.626 1.626 0 0 1-1.371-.753c-.83-1.304-1.486-3.074-.314-4.082A2.74 2.74 0 0 1 12 7.75Zm5.75 1 1.5 1.25-.379 1.515a1.99 1.99 0 0 0 0 .97L19.25 14l-1.5 1.25m-11.5-6.5L4.75 10l.379 1.515a2 2 0 0 1 0 .97L4.75 14l1.5 1.25"
      />
    </svg>
  );
}
