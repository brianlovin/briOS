import { IconProps } from "./types";

export function PersonHeart({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M11.25 7a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
      />
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M16.498 5.403c-.55-.715-1.467-.907-2.156-.253-.688.654-.785 1.748-.244 2.521l2.4 2.579 2.4-2.579c.542-.773.456-1.874-.244-2.52-.701-.648-1.606-.463-2.156.252Z"
        clipRule="evenodd"
      />
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M9 9.75c-3.4 0-4.25 1.75-4.25 4.5h2v3a2 2 0 0 0 2 2h.5a2 2 0 0 0 2-2v-3h2c0-2.75-.85-4.5-4.25-4.5Z"
      />
    </svg>
  );
}
