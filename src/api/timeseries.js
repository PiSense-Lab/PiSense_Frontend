// CENTRALIZED API HELPER FOR FRONTEND
import BASE_URL from "./base_url";
// const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
const normalize = (n) => Math.round(n * 100) / 100; // ~1km precision

const WEATHER_CACHE_KEY = "weatherDailyCache";

const decodeJwtPayload = (token) => {
  if (!token) return null;
  try {
    const [, payloadBase64] = token.split(".");
    if (!payloadBase64) return null;

    const payload = atob(
      payloadBase64.replace(/-/g, "+").replace(/_/g, "/"),
    );

    return JSON.parse(decodeURIComponent(escape(payload)));
  } catch {
    return null;
  }
};

const getStoredUserIdentity = () => {
  const username = localStorage.getItem("username");
  const userId = localStorage.getItem("userId");

  if (username || userId) {
    return { username, userId };
  }

  const token = localStorage.getItem("token");
  const payload = decodeJwtPayload(token);
  return {
    username: payload?.username ?? null,
    userId: payload?.user_id ?? payload?.sub ?? null,
  };
};

const getWeatherCache = () => {
  try {
    const raw = localStorage.getItem(WEATHER_CACHE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

const saveWeatherCache = (cache) => {
  localStorage.setItem(WEATHER_CACHE_KEY, JSON.stringify(cache));
};

const isSameCacheDay = (cacheDate) => {
  if (!cacheDate) return false;
  return cacheDate === new Date().toISOString().split("T")[0];
};

const buildWeatherDatasets = (
  forecastHourly,
  forecastDaily,
  historicalHourly,
  historicalDaily,
) => [
  {
    id: "weather_forecast_hourly",
    name: "Hourly Weather Forecast",
    description: "7-day hourly weather forecast based on your location.",
    type: "forecast",
    frequency: "hourly",
    data: forecastHourly,
  },
  {
    id: "weather_forecast_daily",
    name: "Daily Weather Forecast",
    description: "7-day daily weather forecast based on your location.",
    type: "forecast",
    frequency: "daily",
    data: forecastDaily,
  },
  {
    id: "weather_historical_hourly",
    name: "Hourly Historical Weather",
    description: "Hourly historical weather data for the past year.",
    type: "historical",
    frequency: "hourly",
    data: historicalHourly,
  },
  {
    id: "weather_historical_daily",
    name: "Daily Historical Weather",
    description: "Daily historical weather data for the past year.",
    type: "historical",
    frequency: "daily",
    data: historicalDaily,
  },
];

// import { fetchWeatherData } from "./indexedbdhelper";

// UPLOAD DATA
export const uploadData = async (
  file,
  type,
  datasetName = null,
  userId = 1,
  projectId = 1,
) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    let url;

    if (type === "csv") {
      // If datasetName exists, use it; otherwise take the file name and remove extension
      const tableName = datasetName ?? file.name.replace(/\.[^/.]+$/, "");
      const params = new URLSearchParams({
        table_name: tableName,
        user_id: userId,
        project_id: projectId,
      });
      url = `${BASE_URL}/datatables/upload_csv/?${params}`;
    } else {
      // Excel — backend derives table name from file
      const params = new URLSearchParams({
        user_id: userId,
        project_id: projectId,
      });
      url = `${BASE_URL}/datatables/upload_excel/?${params}`;
    }

    const response = await fetch(url, {
      method: "POST",
      body: formData,
      // Dont set Content-Type — browser sets multipart boundary automatically
    });

    if (!response.ok)
      throw new Error(`Server responded with status ${response.status}`);

    const data = await response.json();
    return { success: true, message: data };
  } catch (error) {
    console.error(`Error uploading ${type} file:`, error);
    return { success: false, message: error.message };
  }
};

// SUBMIT MANUAL DATA
// Payload: { datasetName, datasetType, rows }
// - datasetName: string — user-provided name for the dataset
// - datasetType: string — category e.g. "weather", "sensor", "custom label"
// - rows: array of objects — each object is a row keyed by column name
export const submitManualData = async ({ datasetName, rows }) => {
  try {
    const params = new URLSearchParams({
      table_name: datasetName,
      json_in: JSON.stringify(rows),
    });

    const response = await fetch(
      `${BASE_URL}/datatables/upload_manual?${params}`,
      {
        method: "POST",
      },
    );

    if (!response.ok) {
      const errorDetail = await response.json();
      console.log("Error detail:", errorDetail);
      throw new Error(`Server responded with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error submitting manual data:", error);
    return { success: false, message: error.message };
  }
};

// Fetch a table from backend
export const getTable = async (tableName, projectId) => {
  const isWeatherProject =
    String(projectId) === "weather-1" || String(projectId) === "1";

  if (isWeatherProject) {
    const cache = getWeatherCache();
    if (cache && isSameCacheDay(cache.date) && Array.isArray(cache.data)) {
      return cache.data.find((d) => d.name === tableName)?.data || null;
    }

    const weatherData = await ensureDailyWeatherCache();
    return weatherData.find((d) => d.name === tableName)?.data || null;
  }

  try {
    const response = await fetch(`${BASE_URL}/datatables/${tableName}`);
    if (!response.ok) {
      throw new Error(`Server responded with status ${response.status}`);
    }
    const json = await response.json();
    return json.data;
  } catch (error) {
    console.error("Error fetching table:", error);
    return null;
  }
};

// src/api/projects.js

export const getProjects = async ({ userId = null, username = null, name = null } = {}) => {
  const weatherProject = {
    project_id: "weather-1",
    project_name: "Weather",
    last_update: new Date().toISOString().split("T")[0],
    total_datasets: 4,
    anomalies: 0,
  };

  const { userId: storedUserId, username: storedUsername } = getStoredUserIdentity();
  userId = userId ?? storedUserId;
  username = username ?? storedUsername;

  const projects = [weatherProject];

  if (userId || username) {
    try {
      const params = new URLSearchParams();
      if (userId) params.append("user_id", userId);
      if (username) params.append("username", username);

      const response = await fetch(`${BASE_URL}/projects?${params}`);
      if (response.ok) {
        const data = await response.json();
        const userProjects = Array.isArray(data)
          ? data
          : Array.isArray(data.projects)
          ? data.projects
          : [];

        const filteredUserProjects = userProjects.filter(
          (project) =>
            project.project_name !== weatherProject.project_name &&
            String(project.project_id) !== String(weatherProject.project_id),
        );

        projects.push(...filteredUserProjects);
      } else {
        console.warn(
          "getProjects: failed to fetch user projects",
          response.status,
        );
      }
    } catch (error) {
      console.error("Error fetching user-specific projects:", error);
    }
  }

  if (name) {
    return projects.filter((p) =>
      p.project_name.toLowerCase().includes(name.toLowerCase()),
    );
  }

  return projects;
};

const getUserLocation = () =>
  new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve({ latitude: 46.73, longitude: -94.69 }); // Default location
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: normalize(position.coords.latitude),
          longitude: normalize(position.coords.longitude),
        });
      },
      () => {
        resolve({ latitude: 46.73, longitude: -94.69 }); // Fallback
      }
    );
  });

const fetchWeatherData = async (endpoint, params) => {
  const url = new URL(`${BASE_URL}${endpoint}`);
  Object.entries(params).forEach(([key, value]) =>
    url.searchParams.append(key, value)
  );

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Server responded with status ${response.status}`);
  }

  return response.json();
};

const fetchWeatherDatasetBundle = async () => {
  const { latitude, longitude } = await getUserLocation();

  const today = new Date();
  const endDate = today.toISOString().split("T")[0];

  const startDateObj = new Date();
  startDateObj.setFullYear(today.getFullYear() - 1);
  const startDate = startDateObj.toISOString().split("T")[0];

  const forecastDays = 7;

  const [
    forecastHourly,
    forecastDaily,
    historicalHourly,
    historicalDaily,
  ] = await Promise.all([
    fetchWeatherData("/weather/forecast-weather/hourly", {
      latitude,
      longitude,
      forecast_days: forecastDays,
    }),
    fetchWeatherData("/weather/forecast-weather/daily", {
      latitude,
      longitude,
      forecast_days: forecastDays,
    }),
    fetchWeatherData("/weather/historical-weather/hourly", {
      latitude,
      longitude,
      start_date: startDate,
      end_date: endDate,
    }),
    fetchWeatherData("/weather/historical-weather/daily", {
      latitude,
      longitude,
      start_date: startDate,
      end_date: endDate,
    }),
  ]);

  return buildWeatherDatasets(
    forecastHourly,
    forecastDaily,
    historicalHourly,
    historicalDaily,
  );
};

export const ensureDailyWeatherCache = async () => {
  const cache = getWeatherCache();
  if (cache && isSameCacheDay(cache.date) && Array.isArray(cache.data)) {
    return cache.data;
  }

  const data = await fetchWeatherDatasetBundle();
  saveWeatherCache({
    date: new Date().toISOString().split("T")[0],
    data,
  });
  return data;
};

/**
 * Fetch datasets associated with a project.
 */
export const getDatasetsForProject = async (projectId) => {
  // Only handle the Weather project (ID: "weather-1" or "1")
  const isWeatherProject =
    String(projectId) === "weather-1" || String(projectId) === "1";

  if (!isWeatherProject) {
    const datasets = {
      "1": [
        { id: "1", name: "timeseries_data" },
        { id: "2", name: "timeseriesdata" },
      ],
      "2": [
        { id: "3", name: "timeseries_data" },
        { id: "4", name: "timeseriesdata" },
      ],
      "3": [
        { id: "5", name: "traffic_jan_2026" },
        { id: "6", name: "traffic_feb_2026" },
      ],
    };

    return datasets[projectId] || [];
  }

  // Return datasets formatted for UI consumption
  return [
      {
        id: "weather_forecast_hourly",
        name: "Hourly Weather Forecast",
      },
      {
        id: "weather_forecast_daily",
        name: "Daily Weather Forecast",
        
      },
      {
        id: "weather_historical_hourly",
        name: "Hourly Historical Weather",
      },
      {
        id: "weather_historical_daily",
        name: "Daily Historical Weather",
      },
    ];
 
};
  


