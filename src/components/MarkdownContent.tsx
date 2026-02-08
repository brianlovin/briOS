"use client";

import { type Components } from "react-markdown";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { CodeBlock } from "@/components/CodeBlock";

const components: Components = {
  h1: ({ children }) => (
    <h1 className="text-primary mt-6 font-sans text-3xl font-bold">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-primary mt-6 font-sans text-2xl font-bold">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-primary mt-5 font-sans text-xl font-bold">{children}</h3>
  ),
  p: ({ children }) => <p className="text-primary leading-[1.6]">{children}</p>,
  blockquote: ({ children }) => (
    <blockquote className="border-primary text-tertiary border-l-3 pl-5 leading-[1.6]">
      {children}
    </blockquote>
  ),
  ul: ({ children }) => <ul className="list-disc space-y-2">{children}</ul>,
  ol: ({ children }) => <ol className="space-y-2">{children}</ol>,
  li: ({ children }) => <li className="text-primary leading-[1.6]">{children}</li>,
  hr: () => <hr className="border-primary my-6 border-t" />,
  img: ({ src, alt }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt || ""} className="w-full rounded-lg" loading="lazy" />
  ),
  table: ({ children }) => (
    <div className="my-6 overflow-x-auto">
      <table className="border-secondary w-full border-collapse rounded-md border text-sm">
        {children}
      </table>
    </div>
  ),
  th: ({ children }) => (
    <th className="bg-tertiary border-secondary text-primary border px-3 py-2 text-left font-semibold">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="border-secondary text-secondary border px-3 py-2 text-left">{children}</td>
  ),
  a: ({ href, children }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="link-body">
      {children}
    </a>
  ),
  pre: ({ children }) => <>{children}</>,
  code: ({ className, children }) => {
    const match = /language-(\w+)/.exec(className || "");
    const isBlock = match !== null;

    if (isBlock) {
      const code = String(children).replace(/\n$/, "");
      return <CodeBlock code={code} language={match[1]} />;
    }

    return <code className="bg-tertiary rounded px-1 py-0.5 text-base">{children}</code>;
  },
};

interface MarkdownContentProps {
  content: string;
}

export function MarkdownContent({ content }: MarkdownContentProps) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
      {content}
    </ReactMarkdown>
  );
}
