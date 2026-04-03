export async function login(
  username: string,
  password: string,
): Promise<boolean> {
  const formData = new URLSearchParams();
  formData.append("username", username);
  formData.append("password", password);

  const response = await fetch("http://localhost:8080/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    credentials: "include",
    body: formData.toString(),
  });

  return response.ok;
}

export async function logout(): Promise<boolean> {
  const response = await fetch("http://localhost:8080/logout", {
    method: "POST",
    credentials: "include",
  });

  return response.ok;
}

export async function checkAuth(): Promise<boolean> {
  try {
    const response = await fetch("http://localhost:8080/api/users", {
      method: "GET",
      credentials: "include",
    });

    if (response.status === 200) return true;
    if (response.status === 401) return false;

    console.warn("Unexpected status:", response.status);
    return false;
  } catch (error) {
    console.error("Auth check failed:", error);
    return false;
  }
}
