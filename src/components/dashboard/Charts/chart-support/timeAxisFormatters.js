const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

function parseTimes(data, timeKey) {
  if (!Array.isArray(data)) return [];

  return data
    .map((row) => new Date(row?.[timeKey]).getTime())
    .filter((timestamp) => Number.isFinite(timestamp));
}

function detectGranularity(timestamps) {
  if (timestamps.length < 2) return "datetime";

  const sorted = [...timestamps].sort((a, b) => a - b);
  const span = sorted[sorted.length - 1] - sorted[0];

  const deltas = [];
  for (let i = 1; i < sorted.length; i += 1) {
    const delta = sorted[i] - sorted[i - 1];
    if (delta > 0) deltas.push(delta);
  }

  if (deltas.length === 0) return "datetime";

  deltas.sort((a, b) => a - b);
  const representativeDelta = deltas[Math.floor(deltas.length / 2)];

  if (representativeDelta < MINUTE) return "seconds";
  if (representativeDelta < HOUR) return "minutes";
  if (representativeDelta < DAY) return "hours";
  if (span <= 400 * DAY) return "days";
  if (span <= 6 * 365 * DAY) return "months";
  return "years";
}

function safeDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function getAdaptiveTimeFormatters(data, timeKey = "time") {
  const timestamps = parseTimes(data, timeKey);
  const granularity = detectGranularity(timestamps);

  const formatTick = (value) => {
    const date = safeDate(value);
    if (!date) return value;

    switch (granularity) {
      case "seconds":
        return date.toLocaleTimeString(undefined, {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });
      case "minutes":
      case "hours":
        return date.toLocaleTimeString(undefined, {
          hour: "2-digit",
          minute: "2-digit",
        });
      case "days":
        return date.toLocaleDateString(undefined, {
          month: "numeric",
          day: "numeric",
        });
      case "months":
        return date.toLocaleDateString(undefined, {
          month: "short",
          year: "numeric",
        });
      case "years":
        return date.toLocaleDateString(undefined, {
          year: "numeric",
        });
      default:
        return date.toLocaleString(undefined, {
          month: "numeric",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
    }
  };

  const formatTooltip = (value) => {
    const date = safeDate(value);
    if (!date) return value;

    if (granularity === "months" || granularity === "years") {
      return date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    }

    return date.toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: granularity === "seconds" ? "2-digit" : undefined,
    });
  };

  return {
    formatTick,
    formatTooltip,
    granularity,
  };
}
