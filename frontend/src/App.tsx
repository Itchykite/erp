import { useEffect, useState } from "react";
import { UsersBar } from "./UserModule";
import { Login, isLoggedIn } from "./LoginModule";

function App() {
  const [userBarVisible, setUserBarVisible] = useState(false);
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);

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
              setUserBarVisible(false);
            }}
          />
        </div>

        {loggedIn && (
          <div className="login-menu">
            <button onClick={() => setUserBarVisible(!userBarVisible)}>
              {userBarVisible ? "Hide User Management" : "Show User Management"}
            </button>
          </div>
        )}
      </div>

      <hr />
      <div className="content">
        {loggedIn && userBarVisible && <UsersBar />}
      </div>
    </div>
  );
}

export default App;
