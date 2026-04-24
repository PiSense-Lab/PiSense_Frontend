import { useState, useEffect } from "react";

const SelectedDataset = ({ datasets, selectedName, onChange }) => {
  const [selected, setSelected] = useState(() => {
    return (
      datasets.find((dataset) => dataset.name === selectedName) ||
      datasets[0] ||
      null
    );
  });

  useEffect(() => {
    const nextSelected =
      datasets.find((dataset) => dataset.name === selectedName) ||
      datasets[0] ||
      null;
    setSelected(nextSelected);
  }, [datasets, selectedName]);

  useEffect(() => {
    if (!selected) return;
    console.log("Updated dataset:", selected);
    onChange?.(selected.name);
  }, [onChange, selected]);

  if (!selected) return null;

  const handleChange = (e) => {
    const match = datasets.find((d) => String(d.id) === e.target.value);
    if (match) setSelected(match);
  };

  return (
    <div className="flex flex-col gap-1">
      <label className="block text-sm/6 font-semibold">Selected Dataset</label>
      <select
        value={String(selected.id)}
        onChange={handleChange}
        className="w-full rounded-md bg-slate-200 dark:bg-pitch py-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-sky"
      >
        {datasets.map((dataset) => (
          <option key={dataset.id} value={String(dataset.id)}>
            {dataset.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectedDataset;