import { useState, useEffect } from "react";
import {
  Label,
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { ChevronUpDownIcon } from "@heroicons/react/16/solid";
import { CheckIcon } from "@heroicons/react/20/solid";

const SelectedDataset = ({ datasets, onChange }) => {
  const [selected, setSelected] = useState(datasets[0]);

  useEffect(() => {
    console.log("Updated dataset:", selected);
    onChange?.(selected.name); // send upward
  }, [onChange, selected]);

  return (
    <Listbox value={selected} onChange={setSelected}>
      <Label className="block text-sm/6 font-semibold ">Selected Dataset</Label>
      <div className="relative">
        <ListboxButton className="grid w-full cursor-default grid-cols-1 rounded-md bg-gray-200 dark:bg-pitch py-1.5 pr-2 pl-4 sm:text-sm/6">
          <span className="col-start-1 row-start-1 flex items-center gap-3 pr-6">
            <span className="block truncate">{selected.name}</span>
          </span>
          <ChevronUpDownIcon
            aria-hidden="true"
            className="col-start-1 row-start-1 size-5 self-center justify-self-end text-gray-400 sm:size-4"
          />
        </ListboxButton>

        <ListboxOptions
          transition
          className="absolute z-10 max-h-40 w-full overflow-auto rounded-md bg-gray-200 dark:bg-pitch py-1 text-base data-leave:transition data-leave:duration-100 data-leave:ease-in data-closed:data-leave:opacity-0 sm:text-sm"
        >
          {datasets.map((dataset) => (
            <ListboxOption
              key={dataset.id}
              value={dataset}
              className="group relative cursor-default py-2 pr-9 pl-4 select-none data-focus:bg-sky data-focus:text-white"
            >
              <div className="flex items-center">
                <span className="block truncate font-normal group-data-selected:font-semibold ">
                  {dataset.name}
                </span>
              </div>

              <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-sky group-not-data-selected:hidden group-data-focus:text-white">
                <CheckIcon aria-hidden="true" className="size-5" />
              </span>
            </ListboxOption>
          ))}
        </ListboxOptions>
      </div>
    </Listbox>
  );
};

export default SelectedDataset;
