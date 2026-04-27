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
    String(projectId) === "weather-1";

  if (isWeatherProject) {
    const cache = getWeatherCache();
    if (cache && isSameCacheDay(cache.date) && Array.isArray(cache.data)) {
      return cache.data.find((d) => d.name === tableName)?.data || null;
    }

    const weatherData = await ensureDailyWeatherCache();
    return weatherData.find((d) => d.name === tableName)?.data || null;
  }

  try {
    const params = new URLSearchParams({
      table_name: tableName,
      project_id: projectId,
    });
    const response = await fetch(
      `${BASE_URL}/datatables/get_table?${params}`,
    );
    if (!response.ok) {
      throw new Error(`Server responded with status ${response.status}`);
    }
    const json = await response.json();

    const extractTableData = (payload) => {
      if (Array.isArray(payload)) return payload;
      if (!payload || typeof payload !== "object") return null;
      if (Array.isArray(payload[tableName])) return payload[tableName];
      if (Array.isArray(payload.data)) return payload.data;
      if (payload.data && typeof payload.data === "object") {
        if (Array.isArray(payload.data[tableName])) return payload.data[tableName];
      }

      for (const value of Object.values(payload)) {
        if (Array.isArray(value)) return value;
      }

      return null;
    };

    return extractTableData(json);
  } catch (error) {
    console.error("Error fetching table:", error);
    return null;
  }
};

export const getTables = async (projectId = 1) => {
  try {
    const response = await fetch(`${BASE_URL}/datatables/?project_id=${projectId}`);
    if (!response.ok) {
      throw new Error(`Server responded with status ${response.status}`);
    }
    const json = await response.json();
    return json;
  } catch (error) {
    console.error("Error fetching table:", error);
    return null;
  }
};


// src/api/projects.js

export const getProjects = async ({ userId = null, name = null } = {}) => {
  const weatherProject = {
    id: "weather-1",
    name: "Weather",
    last_update: new Date().toISOString().split("T")[0],
    total_datasets: 4,
    anomalies: 0,
  };

  const { userId: storedUserId } = getStoredUserIdentity();
  userId = userId ?? storedUserId;

  const projects = [weatherProject];

  if (userId) {
    try {
      const params = new URLSearchParams();
      if (userId) params.append("user_id", userId);
      

      const response = await fetch(`${BASE_URL}/users/get_user_projects?user_id=${userId}`);
      if (response.ok) {
        const data = await response.json();
        projects.push(...data.data);
        const userProjects = Array.isArray(data)
          ? data
          : Array.isArray(data.projects)
          ? data.projects
          : [];

        const filteredUserProjects = userProjects.filter(
          (project) =>
            project.name !== weatherProject.name &&
            String(project.id) !== String(weatherProject.id),
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
  // Only handle the Weather project (ID: "weather-1")
  const isWeatherProject =
    String(projectId) === "weather-1";


  if (!isWeatherProject) {
    // For non-weather projects, fetch datasets from backend = http://192.168.1.90:8000/datatables/?project_id=3
    try {
      // const params = new URLSearchParams({ project_id: projectId });
      const response = await fetch(`${BASE_URL}/datatables?project_id=${projectId}`);
      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }
      const json = await response.json();

      return Array.isArray(json) ? json : [];
    } catch (error) {
      console.error("Error fetching datasets for project:", error);
      return [];
    }

  }
  // get data from weather cache (or fetch if not present/expired) and return in expected format
  const weatherData = await ensureDailyWeatherCache();
  
  // Return datasets formatted for UI consumption
  return [  
          {
          "table_name": "Hourly Weather Forecast",
          "last_updated": weatherData.date || new Date().toISOString().split("T")[0],
          "row_count": weatherData.data.find(d => d.id === "weather_forecast_hourly")?.data.length || 0
        },   
        {
          "table_name": "Daily Weather Forecast",
          "last_updated": weatherData.date || new Date().toISOString().split("T")[0],
          "row_count": weatherData.data.find(d => d.id === "weather_forecast_daily")?.data.length || 0
        },  
        {
          "table_name": "Hourly Historical Weather",
          "last_updated": weatherData.date || new Date().toISOString().split("T")[0],
          "row_count": weatherData.data.find(d => d.id === "weather_historical_hourly")?.data.length || 0
        },  
        {
          "table_name": "Daily Historical Weather",
          "last_updated": weatherData.date || new Date().toISOString().split("T")[0],
          "row_count": weatherData.data.find(d => d.id === "weather_historical_daily")?.data.length || 0
        }
    ];
 
};
  


