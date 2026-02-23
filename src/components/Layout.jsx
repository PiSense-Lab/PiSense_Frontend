import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="flex">
      <Sidebar />

      <div className="w-full ml-16 md:ml-56 ">
        <Header />

        <div className="pt-22 px-4 h-screen dark:bg-pitch">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
