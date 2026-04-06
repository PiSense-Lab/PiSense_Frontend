import React, { useState } from "react";
import RoundButton from "../components/RoundButton";

function Signup({ setToken }) {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    if (formData.username.length < 3)
      newErrors.username = "Username must be at least 3 characters.";

    const strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!strongPassword.test(formData.password))
      newErrors.password =
        "8+ chars with uppercase, lowercase, number, and symbol.";

    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match.";

    return newErrors;
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // TODO: send to your backend
    // If the backend returns a "username taken" error, set it here:
    // setErrors({ username: "Username is already taken." });
  };

  return (
    <>
      <div className="flex h-screen items-center justify-center">
        <div className="bg-white dark:bg-midnight py-8 px-16 rounded-md w-100">
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
              Create your account
            </h2>
          </div>

          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form onSubmit={handleSubmit} className="space-y-2">
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
                <p className="mt-1 text-xs text-red-500">
                  {errors.username ?? ""}
                </p>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm/6 font-medium dark:text-gray-100"
                >
                  Password
                </label>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    autoComplete="new-password"
                    value={formData.password}
                    onChange={handleChange}
                    className="block w-full rounded-md bg-slate-200 dark:bg-pitch px-3 py-1.5 text-base dark:text-white placeholder:text-gray-500 outline-none focus:ring-1 ring-sky sm:text-sm/6"
                  />
                </div>

                <p className="mt-1 text-xs text-red-500">
                  {errors.password ?? ""}
                </p>
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm/6 font-medium dark:text-gray-100"
                >
                  Confirm Password
                </label>
                <div className="mt-2">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    autoComplete="new-password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="block w-full rounded-md bg-slate-200 dark:bg-pitch px-3 py-1.5 text-base dark:text-white placeholder:text-gray-500 outline-none focus:ring-1 ring-sky sm:text-sm/6"
                  />
                </div>

                <p className="mt-1 text-xs text-red-500">
                  {errors.confirmPassword ?? ""}
                </p>
              </div>

              <div>
                <RoundButton
                  type="submit"
                  className="bg-sky text-white w-full mt-8"
                >
                  Create Account
                </RoundButton>
              </div>
            </form>

            <p className="mt-6 text-center text-sm/6 text-gray-400">
              Already a have an account?{" "}
              <a
                href="/signin"
                className="font-semibold text-sky hover:text-sky/80"
              >
                Sign-in
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Signup;
