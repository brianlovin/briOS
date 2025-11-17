"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { codeToHtml } from "shiki";

interface CodeBlockProps {
  code: string;
  language: string;
}

export function CodeBlock({ code, language }: CodeBlockProps) {
  const { resolvedTheme } = useTheme();
  const [html, setHtml] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function highlight() {
      try {
        const theme = resolvedTheme === "light" ? "github-light" : "github-dark";
        const highlighted = await codeToHtml(code, {
          lang: language === "plain text" ? "plaintext" : language,
          theme,
        });

        if (isMounted) {
          setHtml(highlighted);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error highlighting code:", error);
        // Fallback to plaintext if language is not supported
        try {
          const theme = resolvedTheme === "light" ? "github-light" : "github-dark";
          const fallback = await codeToHtml(code, {
            lang: "plaintext",
            theme,
          });
          if (isMounted) {
            setHtml(fallback);
            setIsLoading(false);
          }
        } catch (fallbackError) {
          console.error("Error with fallback highlighting:", fallbackError);
          if (isMounted) {
            setIsLoading(false);
          }
        }
      }
    }

    highlight();

    return () => {
      isMounted = false;
    };
  }, [code, language, resolvedTheme]);

  if (isLoading) {
    return (
      <pre className="bg-tertiary max-w-full overflow-x-auto rounded-lg p-4 text-sm">
        <code>{code}</code>
      </pre>
    );
  }

  return (
    <div
      className="!bg-tertiary max-w-full overflow-x-auto rounded-lg text-sm [&>pre]:!m-0 [&>pre]:!bg-transparent [&>pre]:!p-4"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
