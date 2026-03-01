import React from "react";

const Graph = (data) => {
  if (!data) return <div>No data yet</div>;
  return (
    <div className="flex flex-col rounded-md px-8 py-4 h-full bg-white dark:bg-midnight">
      <h1 className="text-lg font-semibold"> Graph </h1>
      <div className="text-s"> Text </div>
    </div>
  );
};

export default Graph;
