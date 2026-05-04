import { useEffect, useMemo } from "react";
import { filterTimeSeriesByDateRange, getTimeBounds } from "../api/charting";
import usePersistentState from "./usePersistentState";

const ONE_HOUR_MS = 60 * 60 * 1000;
const ONE_DAY_MS = 24 * ONE_HOUR_MS;

function toDateTimeLocal(ms) {
  if (!Number.isFinite(ms)) return "";

  const date = new Date(ms);
  const yyyy = String(date.getFullYear());
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const hh = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");

  return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
}

function parseDateTimeLocal(value) {
  if (!value) return null;
  const timestamp = new Date(value).getTime();
  return Number.isFinite(timestamp) ? timestamp : null;
}

function parsePresetToMs(preset) {
  switch (preset) {
    case "24h":
      return ONE_DAY_MS;
    case "7d":
      return 7 * ONE_DAY_MS;
    case "30d":
      return 30 * ONE_DAY_MS;
    default:
      return null;
  }
}

export default function useDateRangeFilter({
  data,
  persistenceScope,
  timeKey = "time",
}) {
  const [activeRange, setActiveRange] = usePersistentState(
    `${persistenceScope}:activeRange`,
    "all",
  );
  const [startValue, setStartValue] = usePersistentState(
    `${persistenceScope}:rangeStart`,
    "",
  );
  const [endValue, setEndValue] = usePersistentState(
    `${persistenceScope}:rangeEnd`,
    "",
  );

  const bounds = useMemo(() => getTimeBounds(data, timeKey), [data, timeKey]);

  const startMs = useMemo(() => parseDateTimeLocal(startValue), [startValue]);
  const endMs = useMemo(() => parseDateTimeLocal(endValue), [endValue]);

  useEffect(() => {
    if (!bounds) return;

    if (
      activeRange === "24h" ||
      activeRange === "7d" ||
      activeRange === "30d"
    ) {
      const presetMs = parsePresetToMs(activeRange);
      if (!presetMs) return;

      const nextEnd = bounds.maxMs;
      const nextStart = Math.max(bounds.minMs, nextEnd - presetMs);

      setStartValue(toDateTimeLocal(nextStart));
      setEndValue(toDateTimeLocal(nextEnd));
      return;
    }

    if (startMs !== null && startMs < bounds.minMs) {
      setStartValue(toDateTimeLocal(bounds.minMs));
    }

    if (endMs !== null && endMs > bounds.maxMs) {
      setEndValue(toDateTimeLocal(bounds.maxMs));
    }
  }, [bounds, activeRange, startMs, endMs, setStartValue, setEndValue]);

  const invalidRange =
    startMs !== null && endMs !== null && Number(startMs) > Number(endMs);

  const filteredData = useMemo(() => {
    if (invalidRange) return [];

    if (activeRange === "all") {
      return Array.isArray(data) ? data : [];
    }

    return filterTimeSeriesByDateRange(data, {
      timeKey,
      startMs,
      endMs,
    });
  }, [data, timeKey, startMs, endMs, invalidRange]);

  const dataRangeSpan = useMemo(() => {
    if (!bounds) return "";
    const spanMs = bounds.maxMs - bounds.minMs;
    const days = Math.ceil(spanMs / (24 * 60 * 60 * 1000));
    if (days === 1) return "1 day";
    if (days < 30) return `${days} days`;
    const months = Math.round(days / 30);
    if (months === 1) return "1 month";
    return `${months} months`;
  }, [bounds]);

  const handleRangeChange = (range) => {
    setActiveRange(range);

    if (range === "all") {
      setStartValue("");
      setEndValue("");
    }
  };

  const handleStartChange = (value) => {
    setActiveRange("custom");
    setStartValue(value);
  };

  const handleEndChange = (value) => {
    setActiveRange("custom");
    setEndValue(value);
  };

  return {
    activeRange,
    startValue,
    endValue,
    minValue: bounds ? toDateTimeLocal(bounds.minMs) : "",
    maxValue: bounds ? toDateTimeLocal(bounds.maxMs) : "",
    invalidRange,
    filteredData,
    dataRangeSpan,
    onRangeChange: handleRangeChange,
    onStartChange: handleStartChange,
    onEndChange: handleEndChange,
  };
}
