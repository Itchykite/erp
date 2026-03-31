import { useEffect, useState } from "react";
import {
  dbGetUsers,
  dbGetUserById,
  dbCreateUser,
  dbUpdateUser,
  dbDeleteUser,
} from "./User";
import { login, logout, checkAuth } from "./Login";
import type { User } from "./User";
import "./App.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  const [showUsers, setShowUsers] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [showDeleteForm, setShowDeleteForm] = useState(false);

  useEffect(() => {
    checkAuth().then((loggedIn) => {
      setIsLoggedIn(loggedIn);
    });
  }, []);

  if (isLoggedIn === null) {
    return <div>Loading...</div>;
  }

  if (!isLoggedIn) {
    return <LoginForm onLoginSuccess={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className="App">
      <button
        onClick={async () => {
          const success = await logout();
          if (success) {
            setIsLoggedIn(false);
          } else {
            alert("Failed to log out.");
          }
        }}
      >
        Logout
      </button>
      <hr />

      <p> Users</p>
      <button onClick={() => setShowUsers(!showUsers)}>
        {showUsers ? "Hide Users" : "Show Users"}
      </button>
      {showUsers && <GetUsers />}
      <hr />
      <p> Create User</p>
      <button onClick={() => setShowForm(!showForm)}>
        {showForm ? "Hide Form" : "Show Form"}
      </button>
      {showForm && <CreateUser />}
      <hr />
      <p> Update User</p>
      <button onClick={() => setShowUpdateForm(!showUpdateForm)}>
        {showUpdateForm ? "Hide Form" : "Show Form"}
      </button>
      {showUpdateForm && <UpdateUser />}
      <hr />
      <p> Delete User</p>
      <button onClick={() => setShowDeleteForm(!showDeleteForm)}>
        {showDeleteForm ? "Hide Form" : "Show Form"}
      </button>
      {showDeleteForm && <DeleteUser />}
    </div>
  );
}

function GetUsers() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    dbGetUsers().then((data) => {
      setUsers(data);
    });
  }, []);

  return (
    <div>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.name} {user.lastName} ({user.email})
          </li>
        ))}
      </ul>
    </div>
  );
}

function GetUserById() {
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

function CreateUser() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

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
      alert(`User ${createdUser.name} created successfully!`);
      window.location.reload();
    } else {
      alert("Failed to create user.");
      window.location.reload();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />{" "}
      <br />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />{" "}
      <br />
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />{" "}
      <br />
      <input
        type="text"
        placeholder="Last Name"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        required
      />{" "}
      <br />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />{" "}
      <br />
      <button type="submit">Create User</button>
    </form>
  );
}

function UpdateUser() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number | "">("");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    dbGetUsers().then((data) => {
      setUsers(data);
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
    }
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
      alert(`User ${result.name} updated successfully!`);
      window.location.reload();
    } else {
      alert("Failed to update user.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <select value={selectedUserId} onChange={handleUserChange} required>
        <option value="">Select user</option>
        {users.map((user) => (
          <option key={user.id} value={user.id}>
            {user.name} {user.lastName}
          </option>
        ))}
      </select>
      <br />

      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <br />

      <input
        type="password"
        placeholder="New Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br />

      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <br />

      <input
        type="text"
        placeholder="Last Name"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        required
      />
      <br />

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <br />

      <button type="submit">Update User</button>
    </form>
  );
}

function DeleteUser() {
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
    <form onSubmit={handleSubmit}>
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
      <br />
      <button type="submit">Delete User</button>
    </form>
  );
}

type LoginFormProps = {
  onLoginSuccess: () => void;
};

function LoginForm({ onLoginSuccess }: LoginFormProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const success = await login(username, password);

    if (success) {
      onLoginSuccess();
    } else {
      alert("Błędny login lub hasło");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>

      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <br />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <br />

      <button type="submit">Login</button>
    </form>
  );
}

export default App;
