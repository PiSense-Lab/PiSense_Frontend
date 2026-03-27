// CENTRALIZED API HELPER FOR FRONTEND
import BASE_URL from "./base_url";

// UPLOAD DATA
export const uploadData = async (file, type) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);

    const response = await fetch(`${BASE_URL}/api/upload`, {
      method: "POST",
      body: formData,
    });
    if (!response.ok) {
      throw new Error(`Server responded with status ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error uploading data:", error);
    return { success: false, message: error.message };
  }
};

// SUBMIT MANUAL DATA
// Payload: { datasetName, datasetType, rows }
// - datasetName: string — user-provided name for the dataset
// - datasetType: string — category e.g. "weather", "sensor", "custom label"
// - rows: array of objects — each object is a row keyed by column name
export const submitManualData = async ({ datasetName, datasetType, rows }) => {
  try {
    const response = await fetch(`${BASE_URL}/api/manual-data`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ datasetName, datasetType, rows }),
    });
    if (!response.ok) {
      throw new Error(`Server responded with status ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error submitting manual data:", error);
    return { success: false, message: error.message };
  }
};

// FETCH PROCESSED DATA FROM BACKEND
export const getProcessedData = async (dataType, startDate, endDate) => {
  try {
    // NOTE: GET requests cannot have a body — params passed as query string instead
    const params = new URLSearchParams({ dataType, startDate, endDate });
    const response = await fetch(`${BASE_URL}/api/processed-data?${params}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(`Server responded with status ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching processed data:", error);
    return { success: false, message: error.message };
  }
};