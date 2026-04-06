import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { Outlet } from "react-router-dom";

const Layout = ({ setToken }) => {
  if (!open) return null;
  return (
    <div className="flex">
      <Sidebar />

      <div className="w-full ml-16 md:ml-56 ">
        <Header setToken={setToken} />

        <div className="pt-22 px-4 pb-4 h-auto  ">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
