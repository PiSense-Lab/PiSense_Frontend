import React from "react";

import SelectedDataset from "../SelectedDataset";
import UploadButton from "../UploadButton";
import RoundButton from "../RoundButton";

const QuickActions = ({ onUpload, onManualSubmit, setUploadFiles }) => {

  const datasets = [
    {
      id: 1,
      name: "Weather",
    },
    {
      id: 2,
      name: "Battery Degredation",
    },
  ];

  return (
    <div className="flex flex-col gap-2 rounded-md px-8 py-4 bg-white dark:bg-midnight">
      <h1 className="text-lg font-semibold"> Quick Actions: </h1>
      <div className="flex flex-col gap-2 items-center">
        <UploadButton
          onUpload={onUpload}
          onManualSubmit={onManualSubmit}
          setUploadFiles={setUploadFiles}
          className="w-full"
        >
          Upload File
        </UploadButton>

        {/* <RoundButton
          className="bg-gray-200 dark:bg-pitch w-full"
          onClick={() => setCurrentModal(MODALS.MANUAL)}
        >
          Manual Entry
        </RoundButton> */}
        
        <RoundButton
          className="bg-sky text-white w-full"
          onClick={() => onManualSubmit()}
        >
          Manual Entry
        </RoundButton>

      </div>
      <SelectedDataset datasets={datasets} />

    </div>
  );
};
export default QuickActions;
