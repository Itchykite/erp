export type Module = {
  id: number;
  moduleName: string;
};

export type moduleRequest = {
  moduleName: string;
};

export async function dbGetModules(): Promise<Module[]> {
  try {
    const response = await fetch("http://localhost:8080/api/modules", {
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch modules");
    }

    const modules: Module[] = await response.json();
    return modules;
  } catch (error) {
    console.error("Error fetching modules:", error);
    return [];
  }
}

export async function dbCreateModule(
  module: moduleRequest,
): Promise<Module | null> {
  try {
    const response = await fetch("http://localhost:8080/api/modules", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(module),
    });

    if (!response.ok) {
      throw new Error("Failed to create module");
    }

    const createdModule: Module = await response.json();
    return createdModule;
  } catch (error) {
    console.error("Error creating module:", error);
    return null;
  }
}

export async function dbUpdateModule(
  id: number,
  module: moduleRequest,
): Promise<Module | null> {
  try {
    const response = await fetch(`http://localhost:8080/api/modules/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(module),
    });

    if (!response.ok) {
      throw new Error("Failed to update module");
    }

    const updatedModule: Module = await response.json();
    return updatedModule;
  } catch (error) {
    console.error("Error updating module:", error);
    return null;
  }
}

export async function dbDeleteModule(id: number): Promise<boolean> {
  try {
    const response = await fetch(`http://localhost:8080/api/modules/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to delete module");
    }

    return true;
  } catch (error) {
    console.error("Error deleting module:", error);
    return false;
  }
}
