export function ComputerTipIcon({ icon }: { icon?: string }) {
  if (!icon) return null;

  if (icon.startsWith("http") || icon.startsWith("data:")) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={icon} alt="" className="size-5 shrink-0 rounded-sm" />
    );
  }

  return (
    <span className="shrink-0 text-lg leading-none" aria-hidden>
      {icon}
    </span>
  );
}
