import React from "react";
import ReactDOM from "react-dom";
import FileImport from "../features/FileImport";
import { MODALS } from "../constants/modalTypes";

const CenterPortal = ({ open, onClose, currentModal }) => {
  if (!open) return null;

  return ReactDOM.createPortal(
    <>
      <div
        className="bg-gray-950/70 fixed inset-0 z-50"
        onClick={onClose}
      ></div>
      {[MODALS.CSV, MODALS.EXCEL].includes(currentModal) && (
        <FileImport onClose={onClose} currentModal={currentModal} />
      )}
    </>,
    document.getElementById("portal"),
  );
};

export default CenterPortal;
