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
  const response = await fetch("http://localhost:8080/api/users", {
    method: "GET",
    credentials: "include",
  });

  return response.ok;
}
