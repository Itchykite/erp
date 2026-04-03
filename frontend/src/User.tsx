export type Module = {
  id: number;
  moduleName: string;
};

export type User = {
  id: number;
  username: string;
  name: string;
  lastName: string;
  email: string;
  modules: Module[];
};

export type CreateUserRequest = {
  username: string;
  password: string;
  name: string;
  lastName: string;
  email: string;
};

export type UpdateUserRequest = {
  username: string;
  password: string;
  name: string;
  lastName: string;
  email: string;
};

export type AssignModulesRequest = {
  moduleIds: number[];
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
      const errorText = await response.text();
      console.error("Create user backend error:", errorText);
      throw new Error(`Failed to create user: ${errorText}`);
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
  user: UpdateUserRequest,
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
      const errorText = await response.text();
      console.error("Update user backend error:", errorText);
      throw new Error(`Failed to update user: ${errorText}`);
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

export async function dbGetModules(): Promise<Module[]> {
  try {
    const response = await fetch("http://localhost:8080/api/modules", {
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch modules");
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching modules:", error);
    return [];
  }
}

export async function dbAssignModulesToUser(
  userId: number,
  moduleIds: number[],
): Promise<User | null> {
  try {
    const response = await fetch(
      `http://localhost:8080/api/users/${userId}/modules`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ moduleIds }),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Assign modules backend error:", errorText);
      throw new Error(`Failed to assign modules: ${errorText}`);
    }

    return response.json();
  } catch (error) {
    console.error("Error assigning modules:", error);
    return null;
  }
}
