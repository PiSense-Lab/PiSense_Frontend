/**
 * Main entry point for building a normalized time series structure from raw data.
 * 
 * This function:
 * 1. Extracts the data array from various input formats
 * 2. Auto-detects which field contains time information
 * 3. Auto-detects which fields contain numeric metrics
 * 4. Normalizes all rows to a consistent structure with ISO timestamps
 * 
 * @param {Array|Object} json - Raw data (can be direct array or object with nested array)
 * @returns {Object|null} Normalized time series object with structure:
 *   {
 *     timeKey: "time" (the field name for timestamps),
 *     metricKeys: ["temperature", "humidity", ...] (array of numeric field names),
 *     labels: {temperature: "Temperature", humidity: "Humidity", ...} (human-readable labels),
 *     data: [{time: "2024-01-01T00:00:00Z", temperature: 25, humidity: 60}, ...]
 *   }
 *   Returns null if data cannot be processed
 */
export function buildTimeSeries(json) {
  //print the raw JSON to frontend console for debugging
  const data = extractArray(json);
  if (!data || data.length === 0) {
    return { error: "No data found: Input data is empty or invalid" };
  }

  const timeConfig = detectTime(data);
  if (!timeConfig) {
    return { error: "No time field detected: Could not identify a timestamp field in the data" };
  }

  const metricKeys = detectNumericFields(data, timeConfig);
  if (metricKeys.length === 0) {
    return { error: "No numeric metrics found: Could not identify any numeric fields to chart" };
  }

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

export function getTimeBounds(data, timeKey = "time") {
  if (!Array.isArray(data) || data.length === 0) return null;

  let minMs = Infinity;
  let maxMs = -Infinity;

  for (const row of data) {
    const timestamp = new Date(row?.[timeKey]).getTime();
    if (!Number.isFinite(timestamp)) continue;
    if (timestamp < minMs) minMs = timestamp;
    if (timestamp > maxMs) maxMs = timestamp;
  }

  if (!Number.isFinite(minMs) || !Number.isFinite(maxMs)) return null;

  return { minMs, maxMs };
}

export function filterTimeSeriesByDateRange(
  data,
  { startMs = null, endMs = null, timeKey = "time" } = {},
) {
  if (!Array.isArray(data) || data.length === 0) return [];

  return data.filter((row) => {
    const timestamp = new Date(row?.[timeKey]).getTime();
    if (!Number.isFinite(timestamp)) return false;
    if (startMs !== null && timestamp < startMs) return false;
    if (endMs !== null && timestamp > endMs) return false;
    return true;
  });
}

/**
 * Converts snake_case or other field names to human-readable Title Case labels.
 * Examples: "temperature_celsius" → "Temperature Celsius", "temp" → "Temp"
 * 
 * @param {string} key - The field name to format
 * @returns {string} Formatted label
 */
function formatLabel(key) {
  return key
    .replace(/_/g, " ")
    .replace(/\b\w/g, c => c.toUpperCase());
}

/**
 * Extracts an array from the input data.
 * 
 * Handles two formats:
 * 1. Direct array: [{...}, {...}] → returns as-is
 * 2. Object with nested array: {data: [{...}], ExampleData: [{...}]} → finds first non-empty array
 * 
 * This allows the function to work with various API response formats.
 * 
 * @param {Array|Object} json - The input data
 * @returns {Array|null} Array of data objects, or null if no array found
 */
function extractArray(json) {
  if (Array.isArray(json)) return json;

  for (const key in json) {
    if (Array.isArray(json[key]) && json[key]?.length > 0) {
      return json[key];
    }
  }

  return null;
}

/**
 * Auto-detects which field(s) contain time information.
 * 
 * Supports:
 * 1. Composite timestamps: separate "date" and "time" fields (e.g., "2024-01-01" + "14:30:00")
 * 2. Single timestamp fields: 
 *    - ISO date strings (e.g., "2024-01-01T14:30:00Z")
 *    - Date strings (e.g., "2024-01-01")
 *    - Time-only strings in HH:MM:SS or HH:MM format (e.g., "14:30:00", "14:30")
 *    - Unix timestamps (numeric, 1e9 to 1e13 range)
 *    - Fields with common time-related names (date, time, timestamp)
 * 
 * Uses a scoring system that examines the first 20 rows:
 * - +5 points for fields with ISO date strings (parseable by Date.parse)
 * - +4 points for fields with numeric Unix timestamps (1e9 to 1e13 range)
 * - +3 points for time-only strings matching HH:MM:SS or HH:MM patterns
 * - +3 points for fields with common time-related names (date, time, timestamp)
 * 
 * Returns the field with the highest score, or null if no time field detected.
 * 
 * @param {Array} data - Array of data objects to inspect
 * @returns {Object|null} Configuration object:
 *   {type: "composite", keys: ["date", "time"]} or
 *   {type: "single", key: "timestamp"} or
 *   {type: "time-only", key: "time"} or
 *   null if no time field found
 */
function detectTime(data) {
  const sample = data.slice(0, 20);
  const keys = Object.keys(sample[0]);

  // Composite case: date + time
  if (keys.includes("date") && keys.includes("time")) {
    return { type: "composite", keys: ["date", "time"] };
  }

  let bestKey = null;
  let bestScore = 0;
  let bestType = "single";

  for (const key of keys) {
    let score = 0;
    let detectedType = "single";

    for (const row of sample) {
      const value = row[key];

      // Date string (e.g., "2024-01-01T14:30:00Z" or "2024-01-01")
      if (typeof value === "string" && !isNaN(Date.parse(value))) {
        score += 5;
      }

      // Time-only string (e.g., "14:30:00" or "10:00:05")
      if (typeof value === "string" && /^\d{1,2}:\d{2}(:\d{2})?$/.test(value)) {
        score += 3;
        detectedType = "time-only";
        console.log("Detected time-only format in key:", detectedType, "Value:", value);
      }

      // Timestamp number (Unix timestamp in milliseconds: 1e9 to 1e13)
      if (typeof value === "number" && value > 1e9 && value < 1e13) {
        score += 4;
      }
    }

    // Name hint: fields with "date", "time", or "timestamp" in the name get bonus points
    if (/(date|time|timestamp)/i.test(key)) {
      score += 3;
    }

    if (score > bestScore) {
      bestScore = score;
      bestKey = key;
      bestType = detectedType;
    }
  }
  return bestKey ? { type: bestType, key: bestKey } : null;
}

/**
 * Converts timestamp data to ISO 8601 format (consistent format for charting libraries).
 * 
 * Handles:
 * - Composite timestamps: combines date + time fields
 * - Full date strings: parses with Date constructor
 * - Time-only strings: assumes today's date and combines with time
 * - Unix timestamps: converts directly
 * 
 * @param {Object} row - The data row containing timestamp field(s)
 * @param {Object} config - Time configuration from detectTime()
 * @returns {string} ISO 8601 timestamp (e.g., "2024-01-01T14:30:00.000Z")
 */
function buildTimestamp(row, config) {
  if (config.type === "composite") {
    const date = new Date(`${row.date}T${row.time}`);
    if (isNaN(date.getTime())) {
      return { error: `Invalid date composite: ${row.date}T${row.time}` };
    }
    return date.toISOString();
  }
  // for short tests
  if (config.type === "time-only") {
    // For time-only values, use today's date
    // const today = new Date().toISOString().split('T')[0];
    // return new Date(`${today}T${row[config.key]}`).toISOString();
    console.log("Parsing time-only value:", parseTimeToSeconds(row[config.key]));
    return parseTimeToSeconds(row[config.key]);
  }
  
  const date = new Date(row[config.key]);
  if (isNaN(date.getTime())) {
    return { error: `Invalid timestamp value: ${row[config.key]}` };
  }
  return date.toISOString();
}

function parseTimeToSeconds(timeStr) {
  const parts = timeStr.split(":").map(Number);

  if (parts.length === 3) {
    const [h, m, s] = parts;
    return m * 60 + s;
  }

  if (parts.length === 2) {
    const [m, s] = parts;
    return m * 60 + s;
  }

  return null;
}

/**
 * Auto-detects all numeric fields in the data that should be treated as metrics.
 * 
 * Excludes:
 * 1. Time-related fields (identified by timeConfig)
 * 2. ID fields (fields ending with "id" - often used as foreign keys)
 * 
 * Only checks the first 20 rows for performance, which works well for:
 * - Consistent schemas (most time series data)
 * - Large datasets (doesn't need to inspect every row)
 * 
 * Note: Fields with numeric values in the sample but string values later will be
 * included. This is rare but could be a data quality issue in inconsistent datasets.
 * 
 * @param {Array} data - Array of data objects
 * @param {Object} timeConfig - Time configuration from detectTime()
 * @returns {Array} Array of field names that are numeric metrics
 */
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