/* eslint-disable react-hooks/exhaustive-deps */
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
import SideNavbar from "./components/sidenavbar.component";
import EditProfile from "./pages/edit-profile.page";
import ChangePassword from "./pages/change-password.page";
import Notifications from "./pages/notifications.page";
import ManageBlogs from "./pages/manage-blogs.page";

export const UserContext = createContext({});
export const ThemeContext = createContext({});
const darkThemePreference = () =>
  window.matchMedia("(prefers-color-scheme: dark)").matches;

const App = () => {
  const [userAuth, setUserAuth] = useState();
  const [theme, setTheme] = useState(() =>
    darkThemePreference() ? "dark" : "light"
  );

  useEffect(() => {
    let userInSession = lookInSession("user");
    let themeInSession = lookInSession("theme");

    userInSession
      ? setUserAuth(JSON.parse(userInSession))
      : setUserAuth({ accessToken: null });

    if (themeInSession) {
      setTheme(() => {
        document.body.setAttribute("data-theme", themeInSession);
        return themeInSession;
      });
    } else {
      document.body.setAttribute("data-theme", theme);
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <UserContext.Provider value={{ userAuth, setUserAuth }}>
        <Routes>
          <Route path="/" element={<Navbar />}>
            <Route index element={<Home />} />

            <Route path="dashboard" element={<SideNavbar />}>
              <Route path="notifications" element={<Notifications />}></Route>
              <Route path="blogs" element={<ManageBlogs />}></Route>
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

            <Route path="blog/:blog_id" element={<BlogPage />} />

            <Route path="*" element={<PageNotFound />} />
          </Route>

          {/* --------------------------  */}

          <Route path="/editor" element={<Editor />} />
          <Route path="/editor/:blog_id" element={<Editor />} />
        </Routes>
      </UserContext.Provider>
    </ThemeContext.Provider>
  );
};

export default App;
