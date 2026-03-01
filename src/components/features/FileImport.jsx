import React, { useState, useRef } from "react";
import ReactDom from "react-dom";
import RoundButton from "../ui/RoundButton";

import { RxCross2 } from "react-icons/rx";
import { SlCloudUpload } from "react-icons/sl";
import { uploadData } from "../../api/timeseries";

const FileImport = ({
  open,
  onClose,
  currentModal,
  onUpload,
  setUploadFiles,
}) => {
  const [isDragging, setIsDragging] = useState(false); // Track drag state
  const [files, setFiles] = useState([]); // Store multiple files
  const fileInputRef = useRef(null); // Reference to hidden input element
  const dragCounter = useRef(0); // Counter to handle nested drag events
  // State to store upload status messages for user feedback
  const [uploadStatus, setUploadStatus] = useState("");

  const modalTitles = {
    UPLOAD_CSV: "Upload CSV",
    UPLOAD_EXCEL: "Upload Excel",
    MANUAL_ENTRY: "Manual Entry",
  };

  if (!open) return null;

  // Called when files are dragged into the drop zone
  const handleDragEnter = (e) => {
    e.preventDefault(); // Prevent default browser behavior
    dragCounter.current++; // Increment counter for nested elements

    // Check if dragged items contain files
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  };

  // Called when files are dragged out of the drop zone
  const handleDragLeave = (e) => {
    e.preventDefault();
    dragCounter.current--; // Decrement counter

    // Only set dragging to false when all drag events are complete
    if (dragCounter.current === 0) {
      setIsDragging(false);
    }
  };

  // Called continuously while dragging over the drop zone
  const handleDragOver = (e) => {
    e.preventDefault(); // Prevent default behavior (opening file)
  };

  // Called when files are dropped
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    //dragCounter.current = 0;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files); // Convert FileList to Array
      setFiles((prev) => [...prev, ...newFiles]); // Add to existing files
      setUploadFiles((prev) => [...prev, ...newFiles]); // Update parent state with new files
    }
  };

  // Handle regular file input selection
  const handleFileInput = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...selectedFiles]);
      setUploadFiles((prev) => [...prev, ...selectedFiles]); // Update parent state with new files
    }
  };

  // File upload function
  const handleUpload = async () => {
    if (files.length === 0) {
      return setUploadStatus("Please select a file first.");
    }

    try {
      setUploadStatus("Validating files...");

      for (const file of files) {
        const fileName = file.name.toLowerCase();
        const fileType = file.type;

        const isCSV = fileName.endsWith(".csv") || fileType === "text/csv";

        const isExcel =
          fileName.endsWith(".xls") ||
          fileName.endsWith(".xlsx") ||
          fileType === "application/vnd.ms-excel" ||
          fileType ===
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

        // Determine expected type from modal
        const expectedType = currentModal.toLowerCase().includes("csv")
          ? "csv"
          : "excel";

        if (expectedType === "csv" && !isCSV) {
          throw new Error(`${file.name} is not a valid CSV file.`);
        }

        if (expectedType === "excel" && !isExcel) {
          throw new Error(`${file.name} is not a valid Excel file.`);
        }
      }

      setUploadStatus("Uploading...");

      for (const file of files) {
        const type = currentModal.toLowerCase().includes("csv")
          ? "csv"
          : "excel";

        console.log(`Preparing to send: ${file.name} as type: ${type}`);

        const result = await uploadData(file, type);

        if (!result.success) throw new Error(result.message);
      }

      setUploadStatus("Upload completed successfully!");
      onUpload();

      setTimeout(() => {
        setFiles([]);
        setUploadFiles([]);
        onClose();
      }, 1000);
    } catch (error) {
      if (error.message === "Failed to fetch") {
        setUploadStatus("Cannot reach the server");
      } else {
        setUploadStatus(error.message);
      }

      console.error("Upload error:", error);
    }
  };

  // Remove file from the list
  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setUploadFiles((prev) => prev.filter((_, i) => i !== index)); // Update parent state
  };

  // Programmatically open file selection dialog
  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const handleCancel = () => {
    setFiles([]);
    setUploadStatus("");
    onClose();
  };

  const acceptType = currentModal?.toLowerCase().includes("csv")
    ? ".csv,text/csv"
    : ".xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

  return ReactDom.createPortal(
    <>
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-1000 w-80 md:w-120 flex flex-col items-center rounded-md gap-4 px-8 py-6 bg-white dark:bg-midnight">
        <h1 className="text-lg font-semibold">{modalTitles[currentModal]}</h1>
        <div
          className={`border-2 border-dashed border-gray-300 rounded-lg p-10 w-full text-center cursor-pointer transition-all duration-100 ease-in min-h-50 flex items-center justify-center hover:bg-sky/10 hover:scale-102 ${isDragging ? "scale-105 bg-sky/10" : ""}`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={openFileDialog}
        >
          {/* Hidden file input for traditional file selection */}
          <input
            ref={fileInputRef}
            type="file"
            multiple // Allow multiple file selection
            onChange={handleFileInput}
            style={{ display: "none" }}
            accept={acceptType}
          />

          <div className="flex flex-col items-center justify-center">
            <SlCloudUpload className="text-8xl text-gray-400/30 dark:text-white/80" />
            {isDragging ? (
              <p>Drop files here</p>
            ) : (
              <p>Browse files to upload</p>
            )}
          </div>
        </div>

        {/* Display selected files list */}
        <div className="w-full text-nowrap">
          {/* Header (NOT scrollable) */}
          <h3 className="mb-2">
            {files.length > 0
              ? `Uploaded Files: ${files.length}`
              : "No files uploaded"}
          </h3>

          {/* Scrollable container */}
          {files.length > 0 && (
            <div
              className={`h-auto max-h-25 gap-2 flex flex-col ${
                files.length > 1 ? "h-25 overflow-y-scroll" : ""
              }`}
            >
              {files.map((file, index) => (
                <div
                  key={index}
                  className="group flex p-2 justify-between items-center rounded-md w-full bg-gray-100 dark:bg-pitch hover:bg-gray-200"
                >
                  <div className="flex flex-col">
                    <span className="truncate max-w-40 font-bold">
                      {file.name}
                    </span>
                    <span className="text-xs">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </span>
                  </div>
                  <button
                    onClick={() => removeFile(index)}
                    className="text-xl p-2 items-center justify-center rounded-full opacity-0 group-hover:opacity-100 hover:bg-gray-300 dark:hover:bg-pitch"
                  >
                    <RxCross2 />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Status message display */}
        <div className="h-6">
          <p className="text-red-600">{uploadStatus}</p>
        </div>

        <div className="flex gap-4">
          <RoundButton
            className="bg-sky text-white"
            onClick={() => {
              handleUpload();
            }}
          >
            Upload
          </RoundButton>
          <RoundButton
            className="bg-gray-200 dark:bg-pitch"
            onClick={() => {
              handleCancel();
            }}
          >
            Cancel
          </RoundButton>
        </div>
      </div>
    </>,
    document.getElementById("portal"),
  );
};

export default FileImport;
