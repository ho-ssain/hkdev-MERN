/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import UserAuthForm from "./pages/userAuth.page";
import { createContext, useEffect, useState } from "react";
import { lookInSession } from "./common/Session";
import Editor from "./pages/editor.page";
import Home from "./pages/home.page";
import Search from "./pages/search.page";
import PageNotFound from "./pages/404.page";
import Profile from "./pages/profile.page";
import Blog from "./pages/blog.page";
import SideNavbar from "./components/SideNavbar";
import ChangePassword from "./pages/change.password.page";
import EditProfile from "./pages/edit-profile.page";
import Notifications from "./pages/notifications.page";

export const UserContext = createContext({});
export const ThemeContext = createContext({});

function App() {
  const [userAuth, setUserAuth] = useState();

  const [theme, setTheme] = useState("light");

  useEffect(() => {
    let userInSession = lookInSession("user");
    userInSession
      ? setUserAuth(JSON.parse(userInSession))
      : setUserAuth({ accessToken: null });

    document.body.setAttribute("data-theme", theme);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <UserContext.Provider value={{ userAuth, setUserAuth }}>
        <Routes>
          <Route path="/editor" element={<Editor />} />
          <Route path="/editor/:blog_id" element={<Editor />} />

          <Route path="/" element={<Header />}>
            <Route index element={<Home />} />

            <Route path="dashboard" element={<SideNavbar />}>
              <Route path="notifications" element={<Notifications />}></Route>
            </Route>

            <Route path="settings" element={<SideNavbar />}>
              <Route path="edit-profile" element={<EditProfile />}></Route>
              <Route
                path="change-password"
                element={<ChangePassword />}
              ></Route>
            </Route>

            <Route path="signin" element={<UserAuthForm type="sign-in" />} />
            <Route path="signup" element={<UserAuthForm type="sign-up" />} />
            <Route path="search/:query" element={<Search />} />
            <Route path="user/:id" element={<Profile />} />
            <Route path="blog/:blog_id" element={<Blog />} />
            <Route path="*" element={<PageNotFound />} />
          </Route>
        </Routes>
      </UserContext.Provider>
    </ThemeContext.Provider>
  );
}

export default App;
