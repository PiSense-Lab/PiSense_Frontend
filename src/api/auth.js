import BASE_URL from "./base_url";

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
      return { success: true, token: data.access_token };
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
  const formDetails = new URLSearchParams();
  formDetails.append("firstname", firstname);
  formDetails.append("lastname", lastname);
  formDetails.append("email", email);
  formDetails.append("username", username);
  formDetails.append("password", password);

  try {
    const response = await fetch(`${BASE_URL}/users/create_user`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formDetails,
    });

    const data = await response.json();
    console.log(data);

    if (!response.ok) {
      return {
        success: false,
        error: data.detail || "Failed to create account",
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
      error: "Network error",
    };
  }
}
