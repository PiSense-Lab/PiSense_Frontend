import React from "react";

const RoundButton = ({ className, children, ...props }) => {
  return (
    <button
      className={`px-4 py-2 text-center rounded-md text-nowrap hover:brightness-104 dark:hover:brightness-110 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default RoundButton;
