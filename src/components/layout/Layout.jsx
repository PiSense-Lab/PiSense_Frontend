import { React, useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { verifyToken } from "../../api/auth";

const Layout = () => {
  const [checking, setChecking] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const [activeProject, setActiveProject] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    verifyToken(token).then((valid) => {
      if (!valid) {
        localStorage.removeItem("token");
        navigate("/signin", { replace: true });
      } else {
        setChecking(false); // ← only stop checking if valid
      }
    });
  }, [navigate]);

  function isTokenValid() {
    const token = localStorage.getItem("token");
    if (!token) return false;
    try {
      const payloadBase64 = token.split(".")[1];
      if (!payloadBase64) return false;
      const { exp } = JSON.parse(atob(payloadBase64));
      return typeof exp === "number" && Date.now() / 1000 < exp;
    } catch {
      return false;
    }
  }

  useEffect(() => {
    if (!checking && !isTokenValid()) {
      localStorage.removeItem("token");
      navigate("/signin", { replace: true });
    }
  }, [checking, location, navigate]);

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
        <Header onProjectChange={setActiveProject} />

        <div className="pt-22 px-4 pb-4 h-auto  ">
          <Outlet context={{ activeProject }} />
        </div>
      </div>
    </div>
  );
};

export default Layout;