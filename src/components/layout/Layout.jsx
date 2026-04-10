import { React, useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { Outlet, useNavigate } from "react-router-dom";
import { verifyToken } from "../../api/auth";

const Layout = () => {
  const [checking, setChecking] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    verifyToken(token, navigate).finally(() => setChecking(false));
  });

  if (checking)
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="text-gray-400">Loading...</span>
      </div>
    );

  return (
    <div className="flex">
      <Sidebar />

      <div className="w-full ml-16 md:ml-56 ">
        <Header />

        <div className="pt-22 px-4 pb-4 h-auto  ">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
