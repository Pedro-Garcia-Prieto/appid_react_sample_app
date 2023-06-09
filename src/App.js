import React from "react";
import logo from "./logo.svg";
import "./App.css";
import AppID from "ibmcloud-appid-js";

function App() {
  const appID = React.useMemo(() => {
    return new AppID();
  }, []);

  const [errorState, setErrorState] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");

  (async () => {
    try {
      await appID.init({
        clientId:
          process.env.REACT_APP_CLIENTID || window.env.REACT_APP_CLIENTID,
        discoveryEndpoint:
          process.env.REACT_APP_ENDPOINT || window.env.REACT_APP_ENDPOINT,
      });
    } catch (e) {
      setErrorState(true);
      setErrorMessage(e.message);
    }
  })();

  const [welcomeDisplayState, setWelcomeDisplayState] = React.useState(false);
  const [loginButtonDisplayState, setLoginButtonDisplayState] =
    React.useState(true);
  const [userName, setUserName] = React.useState("");

  const loginAction = async () => {
    try {
      const tokens = await appID.signin();
      setErrorState(false);
      setLoginButtonDisplayState(false);
      setWelcomeDisplayState(true);
      setUserName(tokens.idTokenPayload.name);
    } catch (e) {
      setErrorState(true);
      setErrorMessage(e.message);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        {welcomeDisplayState && (
          <div> Welcome {userName}! You are now authenticated.</div>
        )}
        {loginButtonDisplayState && (
          <button
            style={{
              fontSize: "24px",
              backgroundColor: "skyblue",
              border: "none",
            }}
            id="login"
            onClick={loginAction}
          >
            Login
          </button>
        )}
        {errorState && <div style={{ color: "red" }}>{errorMessage}</div>}
      </header>
      <p>CE_SUBDOMAIN:{process.env.CE_SUBDOMAIN}</p>
      <p>clientId.process: {process.env.REACT_APP_CLIENTID}</p>
      <p>clientId.window: {window.env.REACT_APP_CLIENTID}</p>
    </div>
  );
}

export default App;
