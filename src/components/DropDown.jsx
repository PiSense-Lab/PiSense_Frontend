import React, { useState, useEffect } from "react";
import { Select, Option } from "@material-tailwind/react";

const DropDown = () => {
  const [selectedDataset, setSelectedDataset] = useState("");

  useEffect(() => {
    console.log("Updated dataset:", selectedDataset);
  }, [selectedDataset]);

  return (
    <div className="w-72">
      <Select
        label="Select Version"
        value={selectedDataset}
        onChange={(val) => setSelectedDataset(val)}
      >
        <Option value="html">Material Tailwind HTML</Option>
        <Option value="react">Material Tailwind React</Option>
        <Option value="vue">Material Tailwind Vue</Option>
        <Option value="angular">Material Tailwind Angular</Option>
        <Option value="svelte">Material Tailwind Svelte</Option>
      </Select>
    </div>
  );
};

export default DropDown;
