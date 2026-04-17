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

export async function getToken(username, password, rememberMe) {
  const formDetails = new URLSearchParams();
  formDetails.append("username", username);
  formDetails.append("password", password);
  const url = new URL(`${BASE_URL}/users/token`);
  if (rememberMe) {
    url.searchParams.append("extended", "true");
  }

  try {
    const response = await fetch(url.toString(), {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formDetails,
    });

    if (response.ok) {
      const data = await response.json();
      const userId = data.id ?? getUserIdFromToken(data.access_token);

      try {
        await ensureDailyWeatherCache();
      } catch (cacheError) {
        console.warn("Weather cache initialization failed on login:", cacheError);
      }

      return { success: true, token: data.access_token, userId };
    } else {
      const errorData = await response.json();
      return {
        success: false,
        error: errorData.detail || "Authentication failed!",
      };
    }
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: "An error occured. Please try again later.",
    };
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
    return false;
  }
}

export async function createUser(
  firstname,
  lastname,
  email,
  username,
  password,
) {
  try {
    const response = await fetch(`${BASE_URL}/users/create_user`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstname, lastname, email, username, password }),
    });

    const data = await response.json();
    console.log(data);

    if (!response.ok) {
      return {
        success: false,
        error: Array.isArray(data.detail)
          ? data.detail[0].msg
          : data.detail || "Failed to create account",
      };
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: "Something went wrong, please try again later.",
    };
  }
}
