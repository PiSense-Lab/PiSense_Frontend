import React from "react";
import DataTable from "../components/DataTable";
import UploadButton from "../components/UploadButton";

const Data = (onUpload, onManualSubmit, setUploadFiles) => {
  return <div className="flex flex-col items-end gap-2">
    <div className="flex">
      <UploadButton
        onUpload={onUpload}
        onManualSubmit={onManualSubmit}
        setUploadFiles={setUploadFiles}
      >
        Upload File
      </UploadButton>
    </div>
    <DataTable />
  </div>;
};

export default Data;
