import React, { useState, useEffect } from "react";
import {
  dbGetUsers,
  dbGetUserById,
  dbCreateUser,
  dbUpdateUser,
  dbDeleteUser,
  dbGetModules,
  dbAssignModulesToUser,
} from "./User";
import "./UserModule.css";
import type { User, Module } from "./User";

export function UsersBar() {
  const [activePanel, setActivePanel] = useState(null);

  return (
    <div className="users-bar">
      <div className="users-crud-header">
        <div className="users-bar-header">
          <p>Users</p>
          <button
            onClick={() =>
              setActivePanel(activePanel === "users" ? null : "users")
            }
          >
            {activePanel === "users" ? "Hide Users" : "Show Users"}
          </button>
        </div>
        <div className="users-bar-header">
          <p> Create User</p>
          <button
            onClick={() =>
              setActivePanel(activePanel === "create" ? null : "create")
            }
          >
            {" "}
            {activePanel === "create" ? "Hide Form" : "Show Create"}
          </button>
        </div>
        <div className="users-bar-header">
          <p> Update User</p>
          <button
            onClick={() =>
              setActivePanel(activePanel === "update" ? null : "update")
            }
          >
            {" "}
            {activePanel === "update" ? "Hide Form" : "Show Update"}
          </button>
        </div>
        <div className="users-bar-header">
          <p> Delete User</p>
          <button
            onClick={() =>
              setActivePanel(activePanel === "delete" ? null : "delete")
            }
          >
            {activePanel === "delete" ? "Hide Form" : "Show Delete"}
          </button>
        </div>
      </div>

      <hr />
      <div className="users-crud-content">
        <div className="users-crud-content-users-list">
          {activePanel === "users" && <GetUsers />}
        </div>

        <div className="users-crud-content-section">
          {activePanel === "create" && <CreateUser />}
          {activePanel === "update" && <UpdateUser />}
          {activePanel === "delete" && <DeleteUser />}
        </div>
      </div>
    </div>
  );
}

export function GetUsers() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    dbGetUsers().then((data) => {
      setUsers(data);
    });
  }, []);

  return (
    <div className="users-list">
      <ol>
        {users.map((user) => (
          <li key={user.id}>
            {user.name} {user.lastName} ({user.email}) - Modules:{" "}
            {user.modules?.length
              ? user.modules.map((module) => module.moduleName).join(", ")
              : "No modules assigned"}
          </li>
        ))}
      </ol>
    </div>
  );
}

export function GetUserById() {
  const [userId, setUserId] = useState<number | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (userId === null) {
      alert("User ID is required.");
      return;
    }
    const fetchedUser = await dbGetUserById(userId);
    if (fetchedUser) {
      setUser(fetchedUser);
    } else {
      alert("User not found.");
      setUser(null);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          placeholder="User ID"
          value={userId !== null ? userId : ""}
          onChange={(e) => setUserId(Number(e.target.value))}
          required
        />{" "}
        <br />
        <button type="submit">Get User</button>
      </form>
      {user && (
        <div>
          <h3>User Details:</h3>
          <p>
            Name: {user.name} {user.lastName}
          </p>
          <p>Email: {user.email}</p>
        </div>
      )}
    </div>
  );
}

export function CreateUser() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [modules, setModules] = useState<Module[]>([]);
  const [selectedModuleIds, setSelectedModuleIds] = useState<number[]>([]);

  useEffect(() => {
    dbGetModules().then((data) => {
      setModules(data);
    });
  }, []);

  const handleModuleChange = (moduleId: number) => {
    setSelectedModuleIds((prev) =>
      prev.includes(moduleId)
        ? prev.filter((id) => id !== moduleId)
        : [...prev, moduleId],
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newUser = {
      username,
      password,
      name,
      lastName,
      email,
    };

    const createdUser = await dbCreateUser(newUser);

    if (createdUser) {
      await dbAssignModulesToUser(createdUser.id, selectedModuleIds);
      alert(`User ${createdUser.name} created successfully!`);
      window.location.reload();
    } else {
      alert("Failed to create user.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="crud-form">
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Last Name"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <div className="modules-checkbox-list">
        <p>Select modules:</p>
        {modules.map((module) => (
          <label key={module.id}>
            <input
              type="checkbox"
              checked={selectedModuleIds.includes(module.id)}
              onChange={() => handleModuleChange(module.id)}
            />
            {module.moduleName}
          </label>
        ))}
      </div>

      <button type="submit">Create User</button>
    </form>
  );
}

export function UpdateUser() {
  const [users, setUsers] = useState<User[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number | "">("");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedModuleIds, setSelectedModuleIds] = useState<number[]>([]);

  useEffect(() => {
    dbGetUsers().then((data) => {
      setUsers(data);
    });

    dbGetModules().then((data) => {
      setModules(data);
    });
  }, []);

  const handleUserChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = Number(e.target.value);
    setSelectedUserId(id);

    const user = await dbGetUserById(id);
    if (user) {
      setUsername(user.username);
      setName(user.name);
      setLastName(user.lastName);
      setEmail(user.email);
      setPassword("");
      setSelectedModuleIds(user.modules?.map((module) => module.id) ?? []);
    }
  };

  const handleModuleChange = (moduleId: number) => {
    setSelectedModuleIds((prev) =>
      prev.includes(moduleId)
        ? prev.filter((id) => id !== moduleId)
        : [...prev, moduleId],
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedUserId === "") {
      alert("Wybierz użytkownika do edycji.");
      return;
    }

    const updatedUser = {
      username,
      password,
      name,
      lastName,
      email,
    };

    const result = await dbUpdateUser(Number(selectedUserId), updatedUser);

    if (result) {
      await dbAssignModulesToUser(Number(selectedUserId), selectedModuleIds);
      alert(`User ${result.name} updated successfully!`);
      window.location.reload();
    } else {
      alert("Failed to update user.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="crud-form">
      <select value={selectedUserId} onChange={handleUserChange} required>
        <option value="">Select user</option>
        {users.map((user) => (
          <option key={user.id} value={user.id}>
            {user.name} {user.lastName}
          </option>
        ))}
      </select>

      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />

      <input
        type="password"
        placeholder="New Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <input
        type="text"
        placeholder="Last Name"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        required
      />

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <div className="modules-checkbox-list">
        <p>Select modules:</p>
        {modules.map((module) => (
          <label key={module.id}>
            <input
              type="checkbox"
              checked={selectedModuleIds.includes(module.id)}
              onChange={() => handleModuleChange(module.id)}
            />
            {module.moduleName}
          </label>
        ))}
      </div>

      <button type="submit">Update User</button>
    </form>
  );
}

export function DeleteUser() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number | "">("");

  useEffect(() => {
    dbGetUsers().then((data) => {
      setUsers(data);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedUserId === "") {
      alert("Wybierz użytkownika do usunięcia.");
      return;
    }

    const result = await dbDeleteUser(Number(selectedUserId));

    if (result) {
      alert("User deleted successfully!");
      window.location.reload();
    } else {
      alert("Failed to delete user.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="crud-form">
      <select
        value={selectedUserId}
        onChange={(e) => setSelectedUserId(Number(e.target.value))}
        required
      >
        <option value="">Select user</option>
        {users.map((user) => (
          <option key={user.id} value={user.id}>
            {user.name} {user.lastName}
          </option>
        ))}
      </select>
      <button type="submit">Delete User</button>
    </form>
  );
}
