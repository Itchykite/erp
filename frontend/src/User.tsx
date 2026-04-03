export type User = {
  id: number;
  username: string;
  name: string;
  lastName: string;
  email: string;
};

export type CreateUserRequest = {
  username: string;
  password: string;
  name: string;
  lastName: string;
  email: string;
};

export async function dbGetUsers(): Promise<User[]> {
  try {
    const response = await fetch("http://localhost:8080/api/users", {
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch users");
    }

    const users: User[] = await response.json();
    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
}

export async function dbGetUserById(userId: number): Promise<User | null> {
  try {
    const response = await fetch(`http://localhost:8080/api/users/${userId}`, {
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user");
    }

    const user: User = await response.json();
    return user;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}

export async function dbCreateUser(
  user: CreateUserRequest,
): Promise<User | null> {
  try {
    const response = await fetch("http://localhost:8080/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(user),
    });

    if (!response.ok) {
      throw new Error("Failed to create user");
    }

    const createdUser: User = await response.json();
    return createdUser;
  } catch (error) {
    console.error("Error creating user:", error);
    return null;
  }
}

export async function dbUpdateUser(
  userId: number,
  user: CreateUserRequest,
): Promise<User | null> {
  try {
    const response = await fetch(`http://localhost:8080/api/users/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(user),
    });

    if (!response.ok) {
      throw new Error("Failed to update user");
    }

    const updatedUser: User = await response.json();
    return updatedUser;
  } catch (error) {
    console.error("Error updating user:", error);
    return null;
  }
}

export async function dbDeleteUser(userId: number): Promise<boolean> {
  try {
    const response = await fetch(`http://localhost:8080/api/users/${userId}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to delete user");
    }

    return true;
  } catch (error) {
    console.error("Error deleting user:", error);
    return false;
  }
}
