import React, { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/cjs/styles/prism";
import ReactMarkdown from "react-markdown";

const DigitalContentViewer = ({ content }) => {
  if (content === undefined) {
    return <></>;
  }

  const [videoUrl, setVideoUrl] = useState(null);
  const [contentText, setContentText] = useState("");

  useEffect(() => {
    setVideoUrl(content.contentUrl);
    setContentText(content.contentText);
  }, [content]);

  // @ts-ignore
  return (
    <>
      {content.contentType === "Video" && (
        <ReactPlayer className={"col-12 col-md-12"}
                     url={videoUrl}
                     width="100%"
                     height="100%"
                     controls={true}
        />
      )}
      {content.contentType === "Text" && (
        <div className={"col-12 col-md-12"}>
          <ReactMarkdown className={"col-12 col-md-12"}
                         components={{
                           code({ node, inline, className, children, ...props }) {
                             const match = /language-(\w+)/.exec(className || "");
                             return !inline && match ? (
                               <SyntaxHighlighter
                                 children={String(children).replace(/\n$/, "")}
                                 style={dracula}
                                 language={match[1]}
                                 PreTag="div"
                                 {...props}
                               />
                             ) : (
                               <code className={className} {...props}>
                                 {children}
                               </code>
                             );
                           }
                         }}>{decodeURIComponent(contentText)}</ReactMarkdown>
        </div>
      )}
    </>
  );
};

export default DigitalContentViewer;
