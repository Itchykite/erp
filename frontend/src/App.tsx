import { useEffect, useState } from "react";
import { UsersBar } from "./UserModule";
import { Login, isLoggedIn } from "./LoginModule";
import { ModuleBar } from "./ModuleModule";

function App() {
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);

  const [activePanel, setActivePanel] = useState(null);

  const checkLoginStatus = () => {
    isLoggedIn().then((loggedIn) => {
      setLoggedIn(loggedIn);
    });
  };

  useEffect(() => {
    checkLoginStatus();
  }, []);

  if (loggedIn === null) {
    return <div>Loading...</div>;
  }

  return (
    <div className="App">
      <div className="login-info">
        <div className="login-header">
          <Login
            onLoginSuccess={checkLoginStatus}
            onLogoutSuccess={() => {
              setLoggedIn(false);
            }}
          />
        </div>

        {loggedIn && (
          <div className="login-menu">
            <button
              onClick={() =>
                setActivePanel(
                  activePanel === "user_module" ? null : "user_module",
                )
              }
            >
              {activePanel === "user_module"
                ? "Hide User Panel"
                : "Show User Panel"}
            </button>
          </div>
        )}
        {loggedIn && (
          <div className="login-menu">
            <button
              onClick={() =>
                setActivePanel(
                  activePanel === "module_module" ? null : "module_module",
                )
              }
            >
              {activePanel === "module_module"
                ? "Hide Module Panel"
                : "Show Module Panel"}
            </button>
          </div>
        )}
      </div>

      <hr />
      <div className="content">
        {loggedIn && activePanel === "user_module" && <UsersBar />}
        {loggedIn && activePanel === "module_module" && <ModuleBar />}
      </div>
    </div>
  );
}

export default App;
