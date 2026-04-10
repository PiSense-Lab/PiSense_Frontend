import React, { useState, useEffect } from "react";
import RoundButton from "../components/RoundButton";
import { getToken } from "../api/auth";
import { useNavigate } from "react-router-dom";
import { verifyToken } from "../api/auth";

function Signin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    verifyToken(token).then((valid) => {
      if (valid) navigate("/");
    });
  }, []);

  const validateForm = () => {
    if (!username || !password) {
      setError("Username and password are required");
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);

    getToken(username, password, setLoading, setError, navigate);
  };

  return (
    <>
      <div className="flex h-screen items-center justify-center">
        <div className="bg-white dark:bg-midnight py-8 px-16 rounded-md">
          <div className="flex flex-col justify-center items-center">
            <div className="w-40">
              <img src="/Logo.svg" alt="logo" className="flex dark:hidden" />
              <img
                src="/Logo-dark.svg"
                alt="logo"
                className="hidden dark:flex"
              />
            </div>
            <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight dark:text-white">
              Sign in to your account
            </h2>
          </div>

          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm/6 font-medium dark:text-gray-100"
                >
                  Username
                </label>
                <div className="mt-2">
                  <input
                    id="username"
                    name="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="block w-full rounded-md bg-slate-200 dark:bg-pitch px-3 py-1.5 text-base dark:text-white placeholder:text-gray-500 outline-none focus:ring-1 ring-sky sm:text-sm/6"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm/6 font-medium dark:text-gray-100"
                  >
                    Password
                  </label>
                </div>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full rounded-md bg-slate-200 dark:bg-pitch px-3 py-1.5 text-base dark:text-white placeholder:text-gray-500 outline-none focus:ring-1 ring-sky sm:text-sm/6"
                  />
                </div>
              </div>

              <div>
                <RoundButton
                  type="submit"
                  disabled={loading}
                  className="bg-sky text-white w-full mt-8"
                >
                  {loading ? "Signing in..." : "Sign-in"}
                </RoundButton>
              </div>

              {error && (
                <p className="text-xs text-red-500 text-center">{error}</p>
              )}
            </form>

            <p className="mt-6 text-center text-sm/6 text-gray-400">
              Not a member?{" "}
              <a
                href="/signup"
                className="font-semibold text-sky hover:text-sky/80"
              >
                Sign-up
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Signin;
