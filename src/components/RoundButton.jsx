import React from "react";

const RoundButton = ({ className, children, ...props }) => {
  return (
    <button
      className={`px-4 py-2 text-center rounded-full text-nowrap transition-transform duration-100 ease-in hover:scale-104 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default RoundButton;
