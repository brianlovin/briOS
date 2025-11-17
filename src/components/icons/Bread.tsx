import { IconProps } from "./types";

export function Bread({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M5.27355 5.8961L5.12147 6.14733C4.46148 7.23758 4.62385 8.63643 5.51603 9.54651C5.64389 9.67694 5.71552 9.85231 5.71552 10.035V18.25C5.71552 18.8023 6.16323 19.25 6.71552 19.25H17.2922C17.8445 19.25 18.2922 18.8023 18.2922 18.25V10.0346C18.2922 9.85212 18.3636 9.67691 18.491 9.54634C19.3798 8.63556 19.5414 7.23952 18.8843 6.14971L18.7343 5.90076C18.3037 5.1866 17.5306 4.75 16.6967 4.75H7.30708C6.47542 4.75 5.70423 5.18464 5.27355 5.8961Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
