import React, { useState } from "react";

import RoundButton from "../ui/RoundButton";
import SelectedDataset from "../features/SelectedDataset";
import CenterPortal from "../portals/CenterPortal";
import { MODALS } from "../constants/modalTypes";

const QuickActions = () => {
  const [currentModal, setCurrentModal] = useState(null);

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
        <RoundButton
          className="bg-sky text-white w-full"
          onClick={() => setCurrentModal(MODALS.CSV)}
        >
          Upload CSV
        </RoundButton>

        <RoundButton
          className="bg-gray-200 dark:bg-pitch w-full"
          onClick={() => setCurrentModal(MODALS.EXCEL)}
        >
          Upload Excel
        </RoundButton>

        <RoundButton
          className="bg-gray-200 dark:bg-pitch w-full"
          onClick={() => setCurrentModal(MODALS.MANUAL)}
        >
          Manual Entry
        </RoundButton>
      </div>
      <SelectedDataset datasets={datasets} />
      <CenterPortal
        open={currentModal !== null}
        onClose={() => setCurrentModal(null)}
        currentModal={currentModal}
      />
    </div>
  );
};

export default QuickActions;
