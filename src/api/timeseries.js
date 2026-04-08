// CENTRALIZED API HELPER FOR FRONTEND
import BASE_URL from "./base_url";

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
export const getTable = async (tableName) => {
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
      p.project_name.toLowerCase().includes(name.toLowerCase())
    );
  }

  return projects;
};

export const getDatasetsForProject = async (projectId) => {
  // Mock dataset list based on projectId
  const datasets = {
    "1": [
      { id: "1", name: "timeseries_data" },
      { id: "2", name: "timeseriesdata" },
    ],
    "2": [
      { id: "3", name: "energy_jan_2026" },
      { id: "4", name: "energy_feb_2026" },
    ],
    "3": [
      { id: "5", name: "traffic_jan_2026" },
      { id: "6", name: "traffic_feb_2026" },
    ],
  };

  return datasets[projectId] || [];
};
