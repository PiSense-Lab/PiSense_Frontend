import React from "react";

const SmallContainer = ({ topic }) => {
  return (
    <div className="flex flex-col rounded-md px-8 py-4 bg-white dark:bg-midnight">
      <h1 className="text-lg font-semibold"> {topic.name} </h1>
      <p className="text-s"> {topic.value} </p>
    </div>
  );
};

export default SmallContainer;
