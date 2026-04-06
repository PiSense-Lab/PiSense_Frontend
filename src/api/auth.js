import BASE_URL from "./base_url";

export async function loginUser(username, password) {
  // --- MOCK: remove this block when backend is ready ---
  if (username === "test" && password === "1234") {
    return { access_token: "fake-token-123" };
  } else {
    throw new Error("Invalid username or password.");
  }
  // --- END MOCK ---

  //   const body = new URLSearchParams();
  //   body.append("username", username);
  //   body.append("password", password);

  //   const response = await fetch(`${API_URL}/token`, {
  //     method: "POST",
  //     headers: { "Content-Type": "application/x-www-form-urlencoded" },
  //     body,
  //   });

  //   const data = await response.json();
  //   if (!response.ok)
  //     throw new Error(data.detail ?? "Invalid username or password.");
  //   return data;
}
