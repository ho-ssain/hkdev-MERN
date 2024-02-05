/* eslint-disable no-unused-vars */
import { Route, Routes } from "react-router-dom";
import Navbar from "./components/navbar.component";
import UserAuthForm from "./pages/userAuthForm.page";
import { createContext, useEffect, useState } from "react";
import { lookInSession } from "./common/session";
import Editor from "./pages/editor.pages";
import Home from "./pages/home.page";
import Search from "./pages/search.page";
import PageNotFound from "./pages/404.page";
import Profile from "./pages/profile.page";
import BlogPage from "./pages/blog.page";

export const UserContext = createContext({});
export const ThemeContext = createContext({});

const App = () => {
  const [userAuth, setUserAuth] = useState();

  // const [theme, setTheme] = useState("light");

  useEffect(() => {
    let userInSession = lookInSession("user");
    userInSession
      ? setUserAuth(JSON.parse(userInSession))
      : setUserAuth({ accessToken: null });

    // document.body.setAttribute("data-theme", theme);
  }, []);

  return (
    <UserContext.Provider value={{ userAuth, setUserAuth }}>
      <Routes>
        <Route path="/" element={<Navbar />}>
          <Route index element={<Home />} />
          <Route path="signin" element={<UserAuthForm type="sign-in" />} />
          <Route path="signup" element={<UserAuthForm type="sign-up" />} />
          <Route path="search/:query" element={<Search />} />
          <Route path="user/:id" element={<Profile />} />
          <Route path="blog/:blog_id" element={<BlogPage />} />
          <Route path="*" element={<PageNotFound />} />
        </Route>

        {/* --------------------------  */}

        <Route path="/editor" element={<Editor />} />
        {/* <Route path="/editor/:blog_id" element={<Editor />} /> */}
      </Routes>
    </UserContext.Provider>
  );
};

export default App;
