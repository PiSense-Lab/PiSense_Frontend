export function buildTimeSeries(json) {
  //print the raw JSON to frontend console for debugging
  console.log('Raw JSON input:', json);
  const data = extractArray(json);
  if (!data || data.length === 0) return null;

  const timeConfig = detectTime(data);
  if (!timeConfig) return null;

  const metricKeys = detectNumericFields(data, timeConfig);

  const normalized = data.map(row => {
  
    const time = buildTimestamp(row, timeConfig);

    const entry = { time };

    metricKeys.forEach(key => {
      entry[key] = row[key];
    });

    return entry;
  });

  return {
    timeKey: "time",
    metricKeys,
    labels: metricKeys.reduce((acc, key) => {
        acc[key] = formatLabel(key);
        return acc;
    }, {}),
    data: normalized
    };
}

function formatLabel(key) {
  return key
    .replace(/_/g, " ")
    .replace(/\b\w/g, c => c.toUpperCase());
}

function extractArray(json) {
  if (Array.isArray(json)) return json;

  for (const key in json) {
    if (Array.isArray(json[key]) && json[key]?.length > 0) {
      return json[key];
    }
  }

  return null;
}

function detectTime(data) {
  const sample = data.slice(0, 20);
  const keys = Object.keys(sample[0]);

  // Composite case: date + time
  if (keys.includes("date") && keys.includes("time")) {
    return { type: "composite", keys: ["date", "time"] };
  }

  let bestKey = null;
  let bestScore = 0;

  for (const key of keys) {
    let score = 0;

    for (const row of sample) {
      const value = row[key];

      // Date string
      if (typeof value === "string" && !isNaN(Date.parse(value))) {
        score += 5;
      }

      // Timestamp number
      if (typeof value === "number" && value > 1e9 && value < 1e13) {
        score += 4;
      }
    }

    // Name hint
    if (/(date|time|timestamp)/i.test(key)) {
      score += 3;
    }

    if (score > bestScore) {
      bestScore = score;
      bestKey = key;
    }
  }

  return bestKey ? { type: "single", key: bestKey } : null;
}

function buildTimestamp(row, config) {
  if (config.type === "composite") {
    return new Date(`${row.date}T${row.time}`).toISOString();
  }
  return new Date(row[config.key]).toISOString();
}

function detectNumericFields(data, timeConfig) {
  const sample = data.slice(0, 20);
  const numeric = new Set();

  const excluded =
    timeConfig.type === "composite"
      ? new Set(timeConfig.keys)
      : new Set([timeConfig.key]);

  for (const row of sample) {
    for (const key in row) {
      if (excluded.has(key)) continue;

      if (typeof row[key] === "number") {
        if (!/id$/i.test(key)) {
          numeric.add(key);
        }
      }
    }
  }

  return Array.from(numeric);
}