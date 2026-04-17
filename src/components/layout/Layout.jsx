import { React, useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { Outlet, useNavigate } from "react-router-dom";
import { verifyToken } from "../../api/auth";

const Layout = () => {
  const [checking, setChecking] = useState(true);
  const navigate = useNavigate();
  const shouldBypassAuth = import.meta.env.DEV;

  useEffect(() => {
    if (shouldBypassAuth) {
      setChecking(false);
      return;
    }

    const token = localStorage.getItem("token");
    verifyToken(token, navigate).finally(() => setChecking(false));
  }, [navigate, shouldBypassAuth]);

  if (checking) return null;

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
