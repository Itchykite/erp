import { useEffect, useState } from "react";
import { UsersBar } from "./UserModule";
import { Login, isLoggedIn } from "./LoginModule";
import { ModuleBar } from "./ModuleModule";
import { getCurrentUser } from "./Login";
import type { User } from "./User";

function App() {
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);
  const [activePanel, setActivePanel] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const init = async () => {
      const auth = await isLoggedIn();
      setLoggedIn(auth);

      if (auth) {
        const user = await getCurrentUser();
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
    };

    init();
  }, []);

  const checkLoginStatus = async () => {
    const auth = await isLoggedIn();
    setLoggedIn(auth);

    if (auth) {
      const user = await getCurrentUser();
      setCurrentUser(user);
    } else {
      setCurrentUser(null);
    }
  };

  const hasModuleAccess = (moduleName: string) =>
    currentUser?.modules?.some((m) => m.moduleName === moduleName) ?? false;

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
              setCurrentUser(null);
              setActivePanel(null);
            }}
          />
        </div>

        {loggedIn && hasModuleAccess("user_module") && (
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

        {loggedIn && hasModuleAccess("module_module") && (
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
