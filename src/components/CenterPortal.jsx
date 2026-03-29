import React from "react";
import ReactDOM from "react-dom";
import FileImport from "./FileImport";

const CenterPortal = ({
  open,
  onClose,
  onUpload,
  onManualSubmit,
  setUploadFiles,
}) => {
  if (!open) return null;

  return ReactDOM.createPortal(
    <>
      <div
        className="bg-gray-950/70 fixed inset-0 z-50"
        onClick={onClose}
      ></div>

      <FileImport
        open={open}
        onClose={onClose}
        onUpload={onUpload}
        onManualSubmit={onManualSubmit}
        setUploadFiles={setUploadFiles}
      />
    </>,
    document.getElementById("portal"),
  );
};

export default CenterPortal;
