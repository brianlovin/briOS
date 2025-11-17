import { IconProps } from "./types";

export function ElectricScooter({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M8.25 17.5C8.25 18.4665 7.4665 19.25 6.5 19.25C5.5335 19.25 4.75 18.4665 4.75 17.5C4.75 16.5335 5.5335 15.75 6.5 15.75C7.4665 15.75 8.25 16.5335 8.25 17.5ZM8.25 17.5H15.75M15.75 17.5C15.75 18.4665 16.5335 19.25 17.5 19.25C18.4665 19.25 19.25 18.4665 19.25 17.5C19.25 16.5335 18.4665 15.75 17.5 15.75C17.1282 15.75 16.7835 15.866 16.5 16.0637M15.75 17.5C15.75 16.9053 16.0466 16.3799 16.5 16.0637M16.5 16.0637L14.9726 7.93466C14.8569 7.31914 15.3291 6.75 15.9554 6.75H17.25M7 5.75L5.75 8.25H8.25L7 11.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
