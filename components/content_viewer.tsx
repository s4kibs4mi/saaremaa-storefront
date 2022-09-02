import React, { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import CodeBlock from "./codeblock";
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
                         components={CodeBlock}>{decodeURIComponent(contentText)}</ReactMarkdown>
        </div>
      )}
    </>
  );
};

export default DigitalContentViewer;
