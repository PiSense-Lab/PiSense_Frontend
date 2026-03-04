import React from "react";
import RoundButton from "../RoundButton";

const AIInsight = () => {
  return (
    <div className="flex flex-col rounded-md px-8 py-4 bg-white dark:bg-midnight">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold"> AI Insight </h1>
        <p className="text-xs underline cursor-pointer">View Full Insight</p>
      </div>

      <p className="text-s">
        “Temperature has increased by 12% the last month.”
      </p>
      <RoundButton className="bg-sky text-white w-50 mt-10">
        Generate Insight
      </RoundButton>
    </div>
  );
};

export default AIInsight;
