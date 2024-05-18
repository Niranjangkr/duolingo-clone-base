import React from "react";

import ReactMarkdown from "react-markdown";
import "katex/dist/katex.min.css";
import RemarkBreaks from "remark-breaks";
import RehypeKatex from "rehype-katex";
import RemarkGfm from "remark-gfm";
import RehypeHighlight from "rehype-highlight";
import RemarkMath from "remark-math";
import { useRef, RefObject, useMemo } from "react";
// import { useDebouncedCallback } from "use-debounce";

// import { copyToClipboard } from "@/lib/utils"; 

// import mermaid from "mermaid";

import { ThreeDotsLoading } from "@/public/img/icons/icon";

// export function Mermaid(props: { code: string }) {
//   const ref = useRef<HTMLDivElement>(null);
//   const [hasError, setHasError] = useState(false);

//   useEffect(() => {
//     if (props.code && ref.current) {
//       mermaid
//         .run({
//           nodes: [ref.current],
//           suppressErrors: true,
//         })
//         .catch((e) => {
//           setHasError(true);
//           console.error("[Mermaid] ", e.message);
//         });
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [props.code]);

//   if (hasError) {
//     return null;
//   }

//   return (
//     <div
//       className="no-dark mermaid"
//       style={{
//         cursor: "pointer",
//         overflow: "auto",
//       }}
//       ref={ref}
//       onClick={() => console.log("Hi")}
//     >
//       {props.code}
//     </div>
//   );
// }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function PreCode(props: { children: any }) {
  const ref = useRef<HTMLPreElement>(null);
  // const refText = ref.current?.innerText;
  // const [mermaidCode, setMermaidCode] = useState("");

  // const renderMermaid = useDebouncedCallback(() => {
  //   if (!ref.current) return;
  //   const mermaidDom = ref.current.querySelector("code.language-mermaid");
  //   if (mermaidDom) {
  //     setMermaidCode((mermaidDom as HTMLElement).innerText);
  //   }
  // }, 600);

  // useEffect(() => {
  //   setTimeout(renderMermaid, 1);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [refText]);

  return (
    <>
      {/* {mermaidCode.length > 0 && (
        <Mermaid code={mermaidCode} key={mermaidCode} />
      )} */}
      <pre ref={ref}>
        <span
          className="copy-code-button"
          onClick={() => {
            if (ref.current) {
              const code = ref.current.innerText;
              console.log(code);
              // await copyToClipboard(code);
            }
          }}
        ></span>
        {props.children}
      </pre>
    </>
  );
}

function escapeDollarNumber(text: string) {
  let escapedText = "";

  for (let i = 0; i < text.length; i += 1) {
    let char = text[i];
    const nextChar = text[i + 1] || " ";

    if (char === "$" && nextChar >= "0" && nextChar <= "9") {
      char = "\\$";
    }

    escapedText += char;
  }

  return escapedText;
}

function escapeBrackets(text: string) {
  const pattern =
    /(```[\s\S]*?```|`.*?`)|\\\[([\s\S]*?[^\\])\\\]|\\\((.*?)\\\)/g;
  return text.replace(
    pattern,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    (match, codeBlock, squareBracket, roundBracket) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      if (codeBlock) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return codeBlock;
      } else if (squareBracket) {
        return `$$${squareBracket}$$`;
      } else if (roundBracket) {
        return `$${roundBracket}$`;
      }
      return match;
    },
  );
}

function _MarkDownContent(props: { content: string }) {
  const escapedContent = useMemo(() => {
    return escapeBrackets(escapeDollarNumber(props.content));
  }, [props.content]);

  return (
    <ReactMarkdown
      remarkPlugins={[RemarkMath, RemarkGfm, RemarkBreaks]}
      rehypePlugins={[
        RehypeKatex,
        [
          RehypeHighlight,
          {
            detect: false,
            ignoreMissing: true,
          },
        ],
      ]}
      components={{
        // @ts-expect-error for testing
        pre: PreCode,
        p: (pProps) => <p {...pProps} dir="auto" />,
        a: (aProps) => {
          const href = aProps.href || "";
          const isInternal = /^\/#/i.test(href);
          const target = isInternal ? "_self" : aProps.target ?? "_blank";
          return <a {...aProps} target={target} />;
        },
      }}
    >
      {escapedContent}
    </ReactMarkdown>
  );
}

export const MarkdownContent = React.memo(_MarkDownContent);

export function Markdown(
  props: {
    content: string;
    loading?: boolean;
    fontSize?: number;
    parentRef?: RefObject<HTMLDivElement>;
    defaultShow?: boolean;
  } & React.DOMAttributes<HTMLDivElement>,
) {
  const mdRef = useRef<HTMLDivElement>(null);

  return (
    <div
      className="markdown-body"
      style={{
        fontSize: `${props.fontSize ?? 14}px`,
      }}
      ref={mdRef}
      onContextMenu={props.onContextMenu}
      onDoubleClickCapture={props.onDoubleClickCapture}
      dir="auto"
    >
      {props.loading ? (
        <ThreeDotsLoading />
      ) : (
        <MarkdownContent content={props.content} />
      )}
    </div>
  );
}
