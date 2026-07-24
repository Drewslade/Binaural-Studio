import type { ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export interface MarkdownHeading {
  id: string;
  label: string;
}

function plainText(value: ReactNode): string {
  if (typeof value === "string" || typeof value === "number") {
    return String(value);
  }
  if (Array.isArray(value)) {
    return value.map(plainText).join("");
  }
  if (value && typeof value === "object" && "props" in value) {
    return plainText(
      (value as { props?: { children?: ReactNode } }).props?.children
    );
  }
  return "";
}

function headingLabel(value: string): string {
  return value
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[*_~`]/g, "")
    .replace(/<[^>]+>/g, "")
    .trim();
}

function headingSlug(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function uniqueHeadingId(
  label: string,
  counts: Map<string, number>
): string {
  const base = headingSlug(label) || "section";
  const count = counts.get(base) ?? 0;
  counts.set(base, count + 1);
  return count === 0 ? base : `${base}-${count + 1}`;
}

export function extractMarkdownHeadings(markdown: string): MarkdownHeading[] {
  const counts = new Map<string, number>();

  return markdown
    .split("\n")
    .filter((line) => /^##\s+/.test(line))
    .map((line) => headingLabel(line.replace(/^##\s+/, "")))
    .filter(Boolean)
    .map((label) => ({ label, id: uniqueHeadingId(label, counts) }));
}

export default function Markdown({
  children,
  className = "",
}: {
  children: string;
  className?: string;
}) {
  const headingCounts = new Map<string, number>();

  return (
    <div className={`prose ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h2: ({ children: headingChildren, ...props }) => {
            const id = uniqueHeadingId(
              plainText(headingChildren),
              headingCounts
            );
            return (
              <h2 id={id} className="scroll-mt-24" {...props}>
                {headingChildren}
              </h2>
            );
          },
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
