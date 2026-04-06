import BASE_URL from "./base_url";

export async function getToken(
  username,
  password,
  setLoading,
  setError,
  navigate,
) {
  const formDetails = new URLSearchParams();
  formDetails.append("username", username);
  formDetails.append("password", password);

  try {
    const response = await fetch(`${BASE_URL}/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formDetails,
    });

    setLoading(false);

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem("token", data.access_token);
      navigate("/");
    } else {
      const errorData = await response.json();
      setError(errorData.detail || "Authentication failed!");
    }
  } catch (error) {
    setLoading(false);
    setError("An error occured. Please try again later.");
  }
}

export async function verifyToken(token, navigate) {
  if (!token) {
    navigate("/signin");
    return;
  }

  console.log(token);
  try {
    const response = await fetch(`${BASE_URL}/verify-token/${token}`);

    if (!response.ok) {
      throw new Error("Token verification failed");
    }
  } catch (error) {
    localStorage.removeItem("token");
    navigate("/signin");
  }
}
