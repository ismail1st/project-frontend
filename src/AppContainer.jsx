import { useState } from "react";
import Login from "./Login.jsx"; // <-- add .jsx explicitly
import App from "./App.jsx";

export default function AppContainer() {
  const [loggedIn, setLoggedIn] = useState(false);

  return !loggedIn ? <Login onLogin={() => setLoggedIn(true)} /> : <App />;
}
