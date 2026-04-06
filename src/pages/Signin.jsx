import React, { useState } from "react";
import RoundButton from "../components/RoundButton";
import { loginUser } from "../api/auth";

function Signin({ setToken }) {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, general: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await loginUser(formData.username, formData.password);
      localStorage.setItem("token", data.access_token);
      setToken(data.access_token);
    } catch (err) {
      setErrors({ general: err.message });
    }
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
                    required
                    autoComplete="username"
                    value={formData.username}
                    onChange={handleChange}
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
                  {/* <div className="text-sm">
                    <a
                      href="#"
                      className="font-semibold text-sky hover:text-sky"
                    >
                      Forgot password?
                    </a>
                  </div> */}
                </div>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    autoComplete="current-password"
                    value={formData.password}
                    onChange={handleChange}
                    className="block w-full rounded-md bg-slate-200 dark:bg-pitch px-3 py-1.5 text-base dark:text-white placeholder:text-gray-500 outline-none focus:ring-1 ring-sky sm:text-sm/6"
                  />
                </div>
              </div>

              <p className="text-xs text-red-500 text-center">
                {errors.general ?? ""}
              </p>

              <div>
                <RoundButton
                  type="submit"
                  className="bg-sky text-white w-full mt-8"
                >
                  Sign In
                </RoundButton>
              </div>
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
