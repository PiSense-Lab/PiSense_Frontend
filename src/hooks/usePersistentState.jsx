import { useEffect, useState } from "react";

export default function usePersistentState(key, initialValue) {
  const getInitialValue = () => {
    try {
      const raw = localStorage.getItem(key);
      if (raw !== null) {
        return JSON.parse(raw);
      }
    } catch (error) {
      console.warn(`Failed to parse localStorage value for ${key}:`, error);
    }

    return typeof initialValue === "function" ? initialValue() : initialValue;
  };

  const [value, setValue] = useState(getInitialValue);

  useEffect(() => {
    setValue(getInitialValue());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn(`Failed to persist localStorage value for ${key}:`, error);
    }
  }, [key, value]);

  return [value, setValue];
}
