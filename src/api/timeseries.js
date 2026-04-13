// CENTRALIZED API HELPER FOR FRONTEND
import BASE_URL from "./base_url";
// const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
const normalize = (n) => Math.round(n * 100) / 100; // ~1km precision
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
  
  if (projectId == "1"){
     // Get user location
    const { latitude, longitude } = await getUserLocation();

    // Generate date values
    const today = new Date();
    const endDate = today.toISOString().split("T")[0];

    const startDateObj = new Date();
    startDateObj.setFullYear(today.getFullYear() - 1);
    const startDate = startDateObj.toISOString().split("T")[0];

    const forecastDays = 7;

    // Fetch all weather datasets concurrently
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
      const data = [
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
    return data.find(d => d.name === tableName)?.data || null;
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

// Hardcoded project data for now
export const getProjects = async (name = null) => {
  // for the weather project get user time and date that way we can show the most latest data
  const projects = [
    {
      project_id: "1",
      project_name: "Weather",
      last_update: "2026-02-13 14:30",
      total_datasets: 1200,
      anomalies: 4,
    },
    {
      project_id: "2",
      project_name: "Energy",
      last_update: "2026-03-01 09:15",
      total_datasets: 950,
      anomalies: 2,
    },
    {
      project_id: "3",
      project_name: "Traffic",
      last_update: "2026-04-05 18:00",
      total_datasets: 720,
      anomalies: 1,
    },
  ];

  // Optional filtering by name
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

/**
 * Fetch datasets associated with a project.
 */
export const getDatasetsForProject = async (projectId) => {
  // Only handle the Weather project (ID: "1")
  if (String(projectId) !== "1") {
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
  


