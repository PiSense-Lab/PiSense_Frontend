import React from 'react';
import { useEffect, useState } from 'react';
import { uploadData, getProcessedData } from '../api/timeseries';   

const Dashboard = () => {
  const [manualData, setManualData] = useState("");
  const [uploadFile, setUploadFile] = useState(null);
  const [processedData, setProcessedData] = useState(null);
  const [loading, setLoading] = useState(false);

  const mockResponse = { success: true, message: "Mock API worked!", data: [1,2,3,4,5] };
  
  const handleManualSubmit = async () => {
    setLoading(true);
    const response = mockResponse
    //Later replace with actual API call
    console.log("Manual submit response:", response);
    setLoading(false);
  }

  const handleFileUpload = async () => {
    if (!uploadFile) return alert("Please select a file to upload.")
      setLoading(true);
    const response = mockResponse
    //Later replace with actual API call
    console.log("File upload response:", response);
    setLoading(false);
  }  
}
