import { IconProps } from "./types";

export function Buildings({ size = 20, ...rest }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...rest} fill="none">
      <path
        d="M7.75 7.77502H9.25M7.75 10.775H9.25M14.75 13.775H16.25M14.75 10.775H16.25M12.25 19.2496V5.74963C12.25 5.19735 11.8023 4.74963 11.25 4.74963H5.75C5.19772 4.74963 4.75 5.19735 4.75 5.74963V18.2496C4.75 18.8019 5.19772 19.2496 5.75 19.2496H12.25ZM12.25 19.2496H18.25C18.8023 19.2496 19.25 18.8019 19.25 18.2496V8.74963C19.25 8.19735 18.8023 7.74963 18.25 7.74963H12.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
