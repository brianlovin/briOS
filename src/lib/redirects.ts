export type AppRedirect = {
  source: string;
  destination: string;
  permanent: boolean;
};

export const overthoughtRedirects: AppRedirect[] = [
  {
    source: "/overthought",
    destination: "/writing",
    permanent: true,
  },
  {
    source: "/overthought/:path*",
    destination: "/writing",
    permanent: true,
  },
];

function matchRedirectSource(source: string, pathname: string): boolean {
  if (source === pathname) {
    return true;
  }

  if (source.endsWith("/:path*")) {
    const prefix = source.slice(0, -"/:path*".length);
    return pathname.startsWith(`${prefix}/`);
  }

  return false;
}

export function redirectDestination(pathname: string): string | null {
  const match = overthoughtRedirects.find((redirect) =>
    matchRedirectSource(redirect.source, pathname),
  );
  return match?.destination ?? null;
}
