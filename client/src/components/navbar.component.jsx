/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { Link, Outlet, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import logo_white from "../assets/logo_white.png";

import { useContext, useEffect, useState } from "react";
import { ThemeContext, UserContext } from "../App";
import UserNavigationPanel from "./user-navigation.component";
import axios from "axios";
import { storeInSession } from "../common/session";

const Navbar = () => {
  //..................................
  const [searchBoxVisibility, setSearchBoxVisibility] = useState(false);
  const [userNavPanel, setUserNavPanel] = useState(false);
  const navigate = useNavigate();

  const {
    userAuth,
    userAuth: {
      accessToken,
      profile_img,
      new_notification_available,
      isAdmin,
    } = {},
    setUserAuth,
  } = useContext(UserContext) || {};

  let { theme, setTheme } = useContext(ThemeContext);

  useEffect(() => {
    if (accessToken) {
      axios
        .get(import.meta.env.VITE_SERVER_DOMAIN + "/new-notification", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then(({ data }) => {
          setUserAuth({ ...userAuth, ...data });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [accessToken]);
  //...................................
  const handleSearch = (e) => {
    const query = e.target.value;

    if (e.keyCode === 13 && query.length) {
      navigate(`/search/${query}`);
    }
  };

  //...................................
  const handleUserNavPanel = () => {
    setUserNavPanel((currentVal) => !currentVal);
  };

  //................................... for out of focus on the menu bar
  const handleBlur = () => {
    setTimeout(() => {
      setUserNavPanel(false);
    }, 300);
  };

  // change theme
  const changeTheme = () => {
    let newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.body.setAttribute("data-theme", newTheme);
    storeInSession("theme", newTheme);
  };

  return (
    <>
      <nav className="navbar z-50">
        {/* ------ logo ------ */}
        <Link to="/" className="flex-none w-32 relative inline-block">
          <img
            src={theme === "light" ? logo : logo_white}
            alt="logo"
            className="w-full transition-transform transform-gpu hover:scale-110"
          />
        </Link>

        {/* ----- Search Input bar -----  */}
        <div
          className={
            "Search-Input absolute bg-white w-full left-0 top-full mt-0.5 border-b border-grey py-2 px-[5vw] md:border-0 md:block md:relative md:inset-0 md:p-0 md:w-auto md:show " +
            (searchBoxVisibility ? "show" : "hide")
          }
        >
          <input
            type="text"
            placeholder="Search..."
            className="w-full md:w-auto bg-grey p-2 pl-6 pr-[12%] md-pr-6 rounded-full placeholder:text-dark-grey md:pl-12"
            onKeyDown={handleSearch}
          />
          <i className="fi fi-rr-search absolute right-[10%] md:pointer-events-none md:left-5 top-1/2 -translate-y-1/2 text-xl text-dark-grey"></i>
        </div>

        <div className="flex items-center gap-3 md:gap-6 ml-auto">
          {/*--------- Search button ---------------*/}
          <button
            className="md:hidden bg-grey w-10 h-10 rounded-full flex items-center justify-center"
            onClick={() =>
              setSearchBoxVisibility((currentValue) => !currentValue)
            }
          >
            <i className="fi fi-rr-search text-2xl mt-1"></i>
          </button>

          {/*----------Editor link ----------*/}
          {
            //-----------
            isAdmin ? (
              <Link to="/editor" className="hidden md:flex gap-2 link">
                <i className="fi fi-ss-edit"></i>
                <p>Write</p>
              </Link>
            ) : (
              ""
            )
          }
          <button
            className="w-10 h-10 rounded-full bg-grey relative hover:bg-black/10"
            onClick={changeTheme}
          >
            <i
              className={
                "fi fi-rr-" +
                (theme === "light"
                  ? "moon-stars"
                  : "sun" + " text-2xl block mt-1")
              }
            ></i>
          </button>

          {
            //---------------
            accessToken ? (
              <>
                <Link to="/dashboard/notifications">
                  <button className="w-10 h-10 rounded-full bg-grey relative hover:bg-black/10">
                    <i className="fi fi-rr-bell text-2xl block mt-1"></i>
                    {
                      //....................
                      new_notification_available ? (
                        <span className="bg-red w-3 h-3 rounded-full absolute z-10 top-2 right-2"></span>
                      ) : (
                        ""
                      )
                    }
                  </button>
                </Link>

                <div
                  className="relative"
                  onClick={handleUserNavPanel}
                  onBlur={handleBlur}
                >
                  <button className="w-10 h-10 mt-1">
                    <img
                      src={profile_img}
                      alt="profile"
                      className="w-full h-full object-cover rounded-full"
                    />
                  </button>
                  {userNavPanel ? <UserNavigationPanel /> : ""}
                </div>
              </>
            ) : (
              <>
                {/*----------Login link ----------*/}
                <Link to="/signin" className="btn-dark py-1">
                  Sign In
                </Link>

                {/*----------Sign-up link ----------*/}
                <Link to="/signup" className="btn-light py-1 hidden md:block">
                  Sign Up
                </Link>
              </>
            )
          }
        </div>
      </nav>

      <Outlet />
    </>
  );
};

export default Navbar;
