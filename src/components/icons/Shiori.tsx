/* eslint-disable @next/next/no-img-element -- tiny static orb; next/image optimizer is unnecessary */

export function Shiori({ size = 16 }: { size?: number }) {
  return (
    <img
      src="/img/shiori-icon.png"
      alt=""
      width={size}
      height={size}
      className="block"
      aria-hidden
    />
  );
}
