import { IconProps } from "./types";

export function Headphones3({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="m18.866 14.25.347-2.187C19.64 8.148 16.29 4.75 12 4.75s-7.64 3.398-7.213 7.313l.347 2.187m3.308 4.804-.526.128c-1.162.284-2.357-.345-2.668-1.403l-.423-1.437c-.312-1.058.378-2.146 1.54-2.43l.527-.128c.58-.142 1.178.172 1.334.701l.987 3.354c.155.529-.19 1.073-.77 1.215Zm7.116 0 .526.128c1.162.284 2.357-.345 2.668-1.403l.423-1.437c.312-1.058-.378-2.146-1.54-2.43l-.527-.128c-.58-.142-1.178.172-1.334.701l-.987 3.354c-.155.529.19 1.073.77 1.215Z"
      />
    </svg>
  );
}
