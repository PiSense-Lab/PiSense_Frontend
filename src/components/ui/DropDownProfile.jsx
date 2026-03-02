import React from "react";

const DropDownProfile = () => {
  return (
    <div className="fixed flex flex-col top-18 right-5 p-4 z-1000 shadow bg-white dark:bg-midnight">
      <ul className="space-y-2 flex-1 ">
        <li>Profile</li>
        <li>Settings</li>
        <li>Logout</li>
      </ul>
    </div>
  );
};

export default DropDownProfile;
