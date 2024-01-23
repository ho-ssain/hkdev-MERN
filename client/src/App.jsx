import { Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import UserAuthForm from "./pages/userAuth.page";
import { createContext, useEffect, useState } from "react";
import { lookInSession } from "./common/Session";

export const UserContext = createContext({});

function App() {
  const [userAuth, setUserAuth] = useState();

  useEffect(() => {
    let userInSession = lookInSession("user");
    userInSession
      ? setUserAuth(JSON.parse(userInSession))
      : setUserAuth({ accessToken: null });
  }, []);

  return (
    <UserContext.Provider value={{ userAuth, setUserAuth }}>
      <Routes>
        <Route path="/" element={<Header />}>
          <Route path="signin" element={<UserAuthForm type="sign-in" />} />
          <Route path="signup" element={<UserAuthForm type="sign-up" />} />
        </Route>
      </Routes>
    </UserContext.Provider>
  );
}

export default App;
