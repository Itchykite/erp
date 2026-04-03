import { useState, useEffect } from "react";
import { login, logout, checkAuth } from "./Login";

type LoginFormProps = {
  onLoginSuccess: () => void;
};

type LoginProps = {
  onLoginSuccess?: () => void;
  onLogoutSuccess?: () => void;
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
    <form onSubmit={handleSubmit} className="login-form">
      <h2>Login</h2>

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
      <br />

      <button type="submit">Login</button>
    </form>
  );
}

export function isLoggedIn(): Promise<boolean> {
  return checkAuth();
}

export function Login({ onLoginSuccess, onLogoutSuccess }: LoginProps) {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    checkAuth().then((loggedIn) => {
      setIsUserLoggedIn(loggedIn);
    });
  }, []);

  if (isUserLoggedIn === null) {
    return <div>Loading...</div>;
  }

  if (!isUserLoggedIn) {
    return (
      <LoginForm
        onLoginSuccess={() => {
          setIsUserLoggedIn(true);
          onLoginSuccess?.();
        }}
      />
    );
  }

  return (
    <div className="login-button">
      <button
        onClick={async () => {
          const success = await logout();
          if (success) {
            setIsUserLoggedIn(false);
            onLogoutSuccess?.();
          } else {
            alert("Failed to log out.");
          }
        }}
      >
        Logout
      </button>
    </div>
  );
}
