import React, { useState } from "react";
import RoundButton from "../components/RoundButton";
import { useNavigate } from "react-router-dom";
import { getToken, verifyToken, createUser } from "../api/auth";

function Signup() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [passError, setPassError] = useState("");

  const navigate = useNavigate();

  const validatePassword = (value) => {
    const errors = [];

    if (value.length < 8) errors.push("at least 8 characters");
    if (!/[a-z]/.test(value)) errors.push("a lowercase letter");
    if (!/[A-Z]/.test(value)) errors.push("an uppercase letter");
    if (!/[0-9]/.test(value)) errors.push("a number");
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
      errors.push("a special character");
    }

    return errors;
  };

  const validateForm = () => {
    if (!firstName || !lastName || !email || !username || !password) {
      setError("All fields are required");
      return false;
    }

    const passwordErrors = validatePassword(password);
    if (passwordErrors.length > 0) {
      return false;
    }

    setError("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    setError("Submitted");

    const { success, error } = await createUser(
      firstName,
      lastName,
      email,
      username,
      password,
    );

    // const { success, error } = await getToken(username, password);
    // setLoading(false);

    if (success) {
      navigate("/");
    } else {
      setError(error);
    }
  };

  return (
    <div className="flex items-center justify-center py-8">
      <div className="bg-white dark:bg-midnight py-8 px-16 rounded-md">
        <div className="flex flex-col justify-center items-center">
          <div className="w-40">
            <img src="/Logo.svg" alt="logo" className="flex dark:hidden" />
            <img src="/Logo-dark.svg" alt="logo" className="hidden dark:flex" />
          </div>
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight dark:text-white">
            Create your account
          </h2>
        </div>

        <div className="mt-10">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-x-6 gap-y-2">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm/6 font-medium dark:text-gray-100"
                >
                  First Name
                </label>
                <div className="mt-2">
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    autoComplete="given-name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="block w-full rounded-md bg-slate-200 dark:bg-pitch px-3 py-1.5 text-base dark:text-white placeholder:text-gray-500 outline-none focus:ring-1 ring-sky sm:text-sm/6"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm/6 font-medium dark:text-gray-100"
                >
                  Last Name
                </label>
                <div className="mt-2">
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    autoComplete="family-name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="block w-full rounded-md bg-slate-200 dark:bg-pitch px-3 py-1.5 text-base dark:text-white placeholder:text-gray-500 outline-none focus:ring-1 ring-sky sm:text-sm/6"
                  />
                </div>
              </div>

              <div className="col-span-2">
                <label
                  htmlFor="email"
                  className="block text-sm/6 font-medium dark:text-gray-100"
                >
                  Email
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full rounded-md bg-slate-200 dark:bg-pitch px-3 py-1.5 text-base dark:text-white placeholder:text-gray-500 outline-none focus:ring-1 ring-sky sm:text-sm/6"
                  />
                </div>
              </div>

              <div className="col-span-2">
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
                    autoComplete="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="block w-full rounded-md bg-slate-200 dark:bg-pitch px-3 py-1.5 text-base dark:text-white placeholder:text-gray-500 outline-none focus:ring-1 ring-sky sm:text-sm/6"
                  />
                </div>
              </div>

              <div className="col-span-2">
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
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => {
                      const value = e.target.value;
                      setPassword(value);

                      const errors = validatePassword(value);

                      if (errors.length > 0) {
                        setPassError(
                          `Password must include ${errors.join(", ")}`,
                        );
                      } else {
                        setPassError("");
                      }
                    }}
                    className="block w-full rounded-md bg-slate-200 dark:bg-pitch px-3 py-1.5 text-base dark:text-white placeholder:text-gray-500 outline-none focus:ring-1 ring-sky sm:text-sm/6"
                  />
                </div>
              </div>
            </div>

            {passError && (
              <p className="text-xs text-red-500 text-left text-wrap w-96">
                {passError}
              </p>
            )}

            <RoundButton
              type="submit"
              disabled={loading}
              className="bg-sky text-white w-full mt-8"
            >
              {loading ? "Creating account..." : "Create Account"}
            </RoundButton>

            {error && (
              <p className="text-xs text-red-500 text-center">{error}</p>
            )}
          </form>

          <p className="mt-6 text-center text-sm/6 text-gray-400">
            Already have an account?{" "}
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
  );
}

export default Signup;
