import React from "react";
import DataTable from "../components/table/DataTable";
import UploadButton from "../components/UploadButton";

const Data = (onUpload, onManualSubmit, setUploadFiles) => {
  return <div className="">
    <div className="flex fixed z-50">
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
