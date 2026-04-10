import { useState } from "react";
import RoundButton from "./RoundButton";
import CenterPortal from "./CenterPortal";
import { MODALS } from "../constants/modalTypes";

const UploadButton = ({ onUpload, onManualSubmit, setUploadFiles, children, className }) => {
    const [currentModal, setCurrentModal] = useState(null);

    return (
        <>
            <RoundButton
                className={`bg-sky text-white ${className}`}
                onClick={() => setCurrentModal(MODALS.CSV)}

            >
                {children}
            </RoundButton >

            <CenterPortal
                open={currentModal !== null}
                onClose={() => setCurrentModal(null)}
                currentModal={currentModal}
                onUpload={onUpload}
                onManualSubmit={onManualSubmit}
                setUploadFiles={setUploadFiles}
            />
        </>
    );
};

export default UploadButton;
