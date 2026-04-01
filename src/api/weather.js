import BASE_URL from "./base_url";

// Fetch a table from weather API backend forecast data hourly or daily
export const getTable = async (type, forecast_days, longitude, latitude) => {
  try {
    const response = await fetch(`${BASE_URL}/weather/forecast-weather/${type}?forecast_days=${forecast_days}&longitude=${longitude}&latitude=${latitude}`);
    if (!response.ok) {
      throw new Error(`Server responded with status ${response.status}`);
    }
    const json = await response.json();
    return json.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};