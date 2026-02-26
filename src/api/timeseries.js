// CENTRALIZED API HELPER FOR FRONTEND 
import { data } from "react-router-dom";
import BASE_URL from "./base_url";


// UPLOAD DATA 
export const uploadData = async (inputData, inputType) => {
    console.log("Uploading data:", inputData, "of type:", inputType);
    try {
        if (inputType === "manual") {
            const response = await fetch(`${BASE_URL}/api/manual-input`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(inputData),
            });  
            if (!response.ok) { // Handle non-200 responses
            throw new Error(`Server responded with status ${response.status}`);
            }
            return await response.json();
        } 
         else { // CSV or EXCEL upload
            const formData = new FormData();
            formData.append("file", inputData);
            formData.append("type", inputType);
            const response = await fetch(`${BASE_URL}/api/upload`, {
                method: "POST",
                body: formData,
            });
            if (!response.ok) {
                throw new Error(`Server responded with status ${response.status}`);
            }
            return await response.json();
        }
    } catch (error) {
        console.error("Error uploading data:", error);
        return { success: false, message: error.message };
    }
}

// FETCH PROCESSED DATA FROM BACKEND
export const getProcessedData = async (dataType, startDate, endDate) => {
    try {
        const response = await fetch(`${BASE_URL}/api/processed-data`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ dataType, startDate, endDate }),
        });
        if (!response.ok) {
            throw new Error(`Server responded with status ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching processed data:", error);
        return { success: false, message: error.message };
    }
}


