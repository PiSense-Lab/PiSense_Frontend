// CENTRALIZED API HELPER FOR FRONTEND
import BASE_URL from "./base_url";

// FILE UPLOAD
//  uploadData(file, type)  where type is "csv" or "excel"
// CSV:   POST /datatables/upload_csv/
//  - query → table_name, user_id, project_id
//  - body  → multipart file
//
// Excel: POST /datatables/upload_excel/
//  -query → user_id, project_id
//  - body  → multipart file
//
// NOTE: table_name is derived from the filename for Excel
// NOTE: user_id hardcoded to 1 until auth is implemented.
// NOTE: dataset_type not yet supported by backend — collected in UI for next sprint.
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
    if (!response.ok) {
      throw new Error(`Server responded with status ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error uploading ${type} file:`, error);
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
