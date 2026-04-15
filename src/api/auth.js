import BASE_URL from "./base_url";
import { ensureDailyWeatherCache } from "./timeseries";

const decodeJwtPayload = (token) => {
  if (!token) return null;
  try {
    const [, payloadBase64] = token.split(".");
    if (!payloadBase64) return null;

    const payload = atob(
      payloadBase64.replace(/-/g, "+").replace(/_/g, "/"),
    );

    return JSON.parse(decodeURIComponent(escape(payload)));
  } catch {
    return null;
  }
};

const getUserIdFromToken = (token) => {
  const payload = decodeJwtPayload(token);
  return payload?.id ?? payload?.id ?? payload?.sub ?? null;
};

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
    const response = await fetch(`${BASE_URL}/users/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formDetails,
    });

    setLoading(false);

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("username", username);

      const userId = data.id ?? getUserIdFromToken(data.access_token);
      if (userId) {
        localStorage.setItem("userId", String(userId));
      }

      try {
        await ensureDailyWeatherCache();
      } catch (cacheError) {
        console.warn("Weather cache initialization failed on login:", cacheError);
      }

      navigate("/");
    } else {
      const errorData = await response.json();
      setError(errorData.detail || "Authentication failed!");
    }
  } catch (error) {
    console.error(error);
    setLoading(false);
    setError("An error occured. Please try again later.");
  }
}

export async function verifyToken(token) {
  if (!token) return false;

  try {
    const response = await fetch(`${BASE_URL}/users/verify-token`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return response.ok;
  } catch (error) {
    console.error(error);
    localStorage.removeItem("token");
    return false;
  }
}
