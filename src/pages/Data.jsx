import React from "react";
import DataTable from "../components/DataTable";
import UploadButton from "../components/UploadButton";

const Data = (onUpload, onManualSubmit, setUploadFiles) => {
  return <div className="">
    <div className="flex fixed w-full z-50">
      <UploadButton
        onUpload={onUpload}
        onManualSubmit={onManualSubmit}
        setUploadFiles={setUploadFiles}
      >
        Upload File
      </UploadButton>

    </div>
    <div className="pt-20"><DataTable /></div>
  </div>;
};

export default Data;
