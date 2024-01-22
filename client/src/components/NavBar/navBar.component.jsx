import { Link } from "react-router-dom";
import logo from "../../assets/logo/quill-with-ink.png";
import { useState } from "react";

const NavBar = () => {
  // State for track visibility of Search Box
  const [searchBoxVisibility, setSearchBoxVisibility] = useState(false);

  return (
    <nav className="navbar">
      {/*----- Start------*/}

      {/* logo  */}
      <Link to="/" className="flex-none w-8 h-8">
        <img src={logo} alt="logo" className="w-full h-full" />
      </Link>

      {/* Search Box  */}
      <div
        className={
          "absolute bg-white w-full left-0 top-full mt-0.5 border-b border-grey py-4 px-[5vw] md:border-0 md:block md:relative md:inset-0 md:p-0 md:w-auto md:show " +
          (searchBoxVisibility ? "show" : "hide")
        }
      >
        <input
          type="text"
          placeholder="Search"
          className="w-full md:w-auto bg-grey p-2 pl-6 pr-[12%] md:pr-6 rounded-full placeholder:text-dark-grey md:pl-12"
        />

        <i className="fi fi-rr-search absolute right-[10%] md:pointer-events-none md:left-5 top-1/2 -translate-y-1/2 text-dark-grey"></i>
      </div>

      {/* Nav Links (Search, Editor, Sign In, Sign Up)  */}
      <div className="flex items-center gap-3 md:gap-6 ml-auto">
        {/* Search  */}
        <button
          className="md:hidden bg-grey w-12 h-12 rounded-full flex items-center justify-center"
          onClick={() => setSearchBoxVisibility((currenValue) => !currenValue)}
        >
          <i className="fi fi-rr-search text-xl"></i>
        </button>

        {/* editor  */}
        <Link to="/editor" className="hidden md:flex gap-2 link">
          <i className="fi fi-rr-file-edit"></i>
          <p>Write</p>
        </Link>

        {/* Sign In  */}
        <Link to="/signin" className="btn-dark py-1">
          Sign In
        </Link>

        {/* Sign In  */}
        <Link to="signup" className="btn-light py-1 hidden md:block">
          Sign Up
        </Link>
      </div>

      {/*----- End------*/}
    </nav>
  );
};

export default NavBar;
