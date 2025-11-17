import Link from "next/link";
import { PropsWithChildren } from "react";

import { cn } from "@/lib/utils";

export function Section({ children, className = "" }: PropsWithChildren & { className?: string }) {
  return <div className={cn("flex flex-col gap-4 px-4", className)}>{children}</div>;
}

export function SectionHeading({
  children,
  className = "",
}: PropsWithChildren & { className?: string }) {
  return (
    <div className={cn("text-quaternary dark:text-tertiary leading-[1.6] select-none", className)}>
      {children}
    </div>
  );
}

export function InlineLink({ href, children }: PropsWithChildren<{ href: string }>) {
  return (
    <a href={href} target="_blank" className="link-body">
      {children}
    </a>
  );
}

interface ListProps extends PropsWithChildren {
  className?: string;
}

interface ListItemProps extends PropsWithChildren {
  className?: string;
  href?: string;
}

interface ListItemLabelProps extends PropsWithChildren {
  className?: string;
  href?: string;
}

interface ListItemSubLabelProps extends PropsWithChildren {
  className?: string;
}

export function List({ children, className = "" }: ListProps) {
  return <ul className={cn("flex flex-col gap-1.5", className)}>{children}</ul>;
}

export function ListItem({ children, className = "", href }: ListItemProps) {
  const isLink = href !== undefined;
  const isExternal = isLink && href?.startsWith("http");
  const Element = isLink ? (isExternal ? "a" : Link) : "div";

  return (
    <li className="flex">
      <Element
        href={href ?? ""}
        target={isExternal ? "_blank" : undefined}
        className={cn(
          "inline-flex flex-1 items-center gap-2",
          isLink && "group/list-item",
          className,
        )}
      >
        {children}
      </Element>
    </li>
  );
}

export function ListItemLabel({ children, className = "" }: ListItemLabelProps) {
  return (
    <span
      className={cn(
        "text-primary line-clamp-1 leading-[1.6] font-medium underline-offset-1 group-hover/list-item:underline",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function ListItemSubLabel({ children, className = "" }: ListItemSubLabelProps) {
  return <span className={cn("text-quaternary leading-[1.6]", className)}>{children}</span>;
}
