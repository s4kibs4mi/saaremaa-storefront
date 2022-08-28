import React, { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import md from "markdown-it";
import { Modal } from "react-bootstrap";

const DigitalContentViewer = ({ content }) => {
  if (content === undefined) {
    return <></>;
  }

  const [open, setOpen] = useState(true);

  const [videoUrl, setVideoUrl] = useState(null);
  const [contentText, setContentText] = useState("");
  const setClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    setVideoUrl(content.contentUrl);
    setContentText(content.contentText);
    setOpen(true);
  }, [content]);

  return (
    <>
      <Modal style={{ width: "100%", height: "70%" }} show={open} onHide={() => setClose()} centered>
        <Modal.Header closeButton>
          <Modal.Title>{content.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {content.contentType === "Video" && (
            <ReactPlayer
              url={videoUrl}
              width="100%"
              height="100%"
              controls={true}
            />
          )}
          {content.contentType === "Text" && (
            <div
              dangerouslySetInnerHTML={{ __html: md().render(decodeURIComponent(contentText)) }} />
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default DigitalContentViewer;
