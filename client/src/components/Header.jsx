/* eslint-disable no-unused-vars */
import { useContext, useState } from "react";
import logo from "../assets/logo-1.png";
import { Link, Outlet } from "react-router-dom";
import { UserContext } from "../App";
import UserNavigationPanel from "./UserNavigationPanel ";

// import { IoIosSearch } from "react-icons/io";
// import { FaEdit } from "react-icons/fa";

const Header = () => {
  const [searchBoxVisibility, setSearchBoxVisibility] = useState(false);

  const [userNavPanel, setUserNavPanel] = useState(false);

  const { userAuth, userAuth: { accessToken, profile_img } = {} } =
    useContext(UserContext) || {};

  const handleUserNavPanel = () => {
    setUserNavPanel((currentVal) => !currentVal);
  };

  const handleBlur = () => {
    setTimeout(() => {
      setUserNavPanel(false);
    }, 300);
  };

  return (
    <>
      <header>
        <nav className="navbar">
          {/*-------- logo ------------*/}
          <Link to="/" className="flex-none w-20">
            <img src={logo} alt="logo" className="w-full" />
          </Link>

          {/*-------- Search bar ------------*/}
          <div
            className={
              "absolute bg-white w-full  left-0 top-full mt-0.5 border-b border-grey py-2 px-[5vw] md:border-0 md:block md:relative md:inset-0 md:p-0 md:w-auto md:show " +
              (searchBoxVisibility ? "show" : "hide")
            }
          >
            <input
              type="text"
              placeholder="Search..."
              className="w-full md:w-auto bg-grey p-2 pl-6 pr-[12%] md-pr-6 rounded-full placeholder:text-dark-grey md:pl-12"
            />
            <i className="fi fi-rr-search absolute right-[10%] md:pointer-events-none md:left-5 top-1/2 -translate-y-1/2 text-xl text-dark-grey"></i>
          </div>

          {/*----------------Menu bae  -----------*/}
          <div className="flex items-center gap-3 md:gap-6 ml-auto">
            {/*--------- Search button ---------------*/}
            <button
              className="md:hidden bg-grey w-10 h-10 rounded-full flex items-center justify-center"
              onClick={() =>
                setSearchBoxVisibility((currentValue) => !currentValue)
              }
            >
              <i className="fi fi-rr-search text-xl"></i>
            </button>

            {/*----------Editor link ----------*/}
            <Link to="/editor" className="hidden md:flex gap-2 link">
              <i className="fi fi-ss-edit"></i>
              <p>Write</p>
            </Link>

            {accessToken ? (
              <>
                <Link to="/dashboard/notification">
                  <button className="w-12 h-12 rounded-full bg-grey relative hover:bg-black/10">
                    <i className="fi fi-rr-bell text-2xl block mt-1"></i>
                  </button>
                </Link>
                <div
                  className="relative"
                  onClick={handleUserNavPanel}
                  onBlur={handleBlur}
                >
                  <button className="w-12 h-12 mt-1">
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
            )}
          </div>
        </nav>
      </header>

      <Outlet />
    </>
  );
};

export default Header;
