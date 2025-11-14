import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Typography } from "antd";
import { useTheme } from "../../context/ThemeContext";
import "./MarkdownMessage.css";

const { Text } = Typography;

const MarkdownMessage = ({ content, className = "" }) => {
  const { themeMode } = useTheme();

  // Preprocess content to handle line breaks
  const processedContent = content
    ? content
        .split("\n")
        .map((line, index, array) => {
          // If line is empty and next line is also empty, keep double newline for paragraph break
          if (line.trim() === "" && index < array.length - 1 && array[index + 1].trim() === "") {
            return "\n\n";
          }
          // If line ends with two spaces, preserve as markdown line break
          if (line.endsWith("  ")) {
            return line;
          }
          // Otherwise, ensure single newline is preserved
          return line;
        })
        .join("\n")
    : "";

  return (
    <div className={`markdown-message ${className} ${themeMode === "dark" ? "dark" : ""}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Customize paragraph to preserve spacing
          p: ({ node, ...props }) => (
            <p className="markdown-paragraph" {...props} />
          ),
          // Customize headings
          h1: ({ node, ...props }) => (
            <h1 className="markdown-h1" {...props} />
          ),
          h2: ({ node, ...props }) => (
            <h2 className="markdown-h2" {...props} />
          ),
          h3: ({ node, ...props }) => (
            <h3 className="markdown-h3" {...props} />
          ),
          // Customize lists
          ul: ({ node, ...props }) => (
            <ul className="markdown-list markdown-ul" {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol className="markdown-list markdown-ol" {...props} />
          ),
          li: ({ node, ...props }) => (
            <li className="markdown-li" {...props} />
          ),
          // Customize code blocks
          code: ({ node, inline, className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || "");
            return !inline ? (
              <pre className="markdown-code-block">
                <code className={className} {...props}>
                  {children}
                </code>
              </pre>
            ) : (
              <code className="markdown-inline-code" {...props}>
                {children}
              </code>
            );
          },
          // Customize links
          a: ({ node, ...props }) => (
            <a className="markdown-link" target="_blank" rel="noopener noreferrer" {...props} />
          ),
          // Customize blockquotes
          blockquote: ({ node, ...props }) => (
            <blockquote className="markdown-blockquote" {...props} />
          ),
          // Customize tables
          table: ({ node, ...props }) => (
            <div className="markdown-table-wrapper">
              <table className="markdown-table" {...props} />
            </div>
          ),
          thead: ({ node, ...props }) => (
            <thead className="markdown-thead" {...props} />
          ),
          tbody: ({ node, ...props }) => (
            <tbody className="markdown-tbody" {...props} />
          ),
          tr: ({ node, ...props }) => (
            <tr className="markdown-tr" {...props} />
          ),
          th: ({ node, ...props }) => (
            <th className="markdown-th" {...props} />
          ),
          td: ({ node, ...props }) => (
            <td className="markdown-td" {...props} />
          ),
          // Customize horizontal rule
          hr: ({ node, ...props }) => (
            <hr className="markdown-hr" {...props} />
          ),
          // Customize strong and emphasis
          strong: ({ node, ...props }) => (
            <strong className="markdown-strong" {...props} />
          ),
          em: ({ node, ...props }) => (
            <em className="markdown-em" {...props} />
          ),
        }}
      >
        {processedContent}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownMessage;

