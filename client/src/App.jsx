import { Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import UserAuthForm from "./pages/userAuth.page";
import { createContext, useEffect, useState } from "react";
import { lookInSession } from "./common/Session";
import Editor from "./pages/editor.page";
import Home from "./pages/home.page";
import Search from "./pages/search.page";

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
        <Route path="editor" element={<Editor />} />
        <Route path="/" element={<Header />}>
          <Route index element={<Home />} />
          <Route path="signin" element={<UserAuthForm type="sign-in" />} />
          <Route path="signup" element={<UserAuthForm type="sign-up" />} />
          <Route path="search/:query" element={<Search />} />
        </Route>
      </Routes>
    </UserContext.Provider>
  );
}

export default App;
