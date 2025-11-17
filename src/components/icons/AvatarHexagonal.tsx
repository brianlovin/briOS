import { IconProps } from "./types";

export function AvatarHexagonal({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="m7.615 17.653.677.846a2 2 0 0 0 1.562.751h4.292a2 2 0 0 0 1.562-.75l.677-.847m-8.77 0-2.427-3.034a2 2 0 0 1-.438-1.25V9.722a2 2 0 0 1 .586-1.414l2.971-2.971a2 2 0 0 1 1.414-.586h4.558a2 2 0 0 1 1.414.586l2.971 2.971a2 2 0 0 1 .586 1.414v3.649a2 2 0 0 1-.438 1.25l-2.427 3.033m-8.77 0c.78-.894 2.156-1.903 4.385-1.903 2.23 0 3.604 1.01 4.385 1.903M14.25 10a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
      />
    </svg>
  );
}
