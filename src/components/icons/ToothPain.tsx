import { IconProps } from "./types";

export function ToothPain({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M12 5.786c-.345-.346-1.554-1.036-3.625-1.036-2.59 0-3.625 2.071-3.625 4.143 0 2.071 2.071 6.214 2.071 6.214S7.446 19.25 9 19.25c2 0 3-5.5 3-5.5s1 5.5 3 5.5c1.554 0 2.179-4.143 2.179-4.143l2.071-4.357M16 6.25v-1.5M17.75 8h1.5M16 11.25v-1.5M12.75 8h1.5"
      />
    </svg>
  );
}
