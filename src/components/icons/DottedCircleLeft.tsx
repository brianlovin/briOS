import { IconProps } from "./types";

export function DottedCircleLeft({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M12.25 17.2499C12.25 18.3545 11.3388 19.275 10.2736 18.9826C7.16194 18.1286 4.75 15.3258 4.75 11.9999C4.75 8.67407 7.16194 5.87128 10.2736 5.01721C11.3388 4.72485 12.25 5.64535 12.25 6.74992V17.2499Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17.2584 17.4148C16.5646 18.1979 15.7148 18.8272 14.75 19.2499"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18.9753 9.83398C19.1548 10.522 19.2501 11.2486 19.2501 11.9999C19.2501 12.7513 19.1548 13.4779 18.9753 14.1659"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.75 4.75C15.7148 5.17274 16.5646 5.80194 17.2584 6.5851"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
