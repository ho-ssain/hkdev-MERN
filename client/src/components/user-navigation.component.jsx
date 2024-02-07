import { Link } from "react-router-dom";
import AnimationWrapper from "../common/page-animation";
import { useContext } from "react";
import { UserContext } from "../App";
import { removeFromSession } from "../common/session";

const UserNavigationPanel = () => {
  const { userAuth: { username, isAdmin } = {}, setUserAuth } =
    useContext(UserContext) || {};

  const signOut = () => {
    removeFromSession("user");
    setUserAuth({ accessToken: null });
  };

  return (
    <AnimationWrapper
      transition={{ duration: 0.2 }}
      className="absolute right-0 z-50"
    >
      <div className="bg-white absolute right-0 border border-grey w-40 duration-200">
        {
          //----------------------------
          isAdmin ? (
            <Link to="/editor" className="flex gap-2 link md:hidden pl-8 py-3">
              <i className="fi fi-ss-edit"></i>
              <p>Write</p>
            </Link>
          ) : (
            ""
          )
        }

        <Link to={`/user/${username}`} className="link pl-8 py-3">
          Profile
        </Link>

        <Link to="/dashboard/blogs" className="link pl-8 py-3">
          Dashboard
        </Link>

        <Link to="/settings/edit-profile" className="link pl-8 py-3">
          Settings
        </Link>

        <span className="absolute border-t border-grey w-[100%]"></span>
        <button
          className="text-left p-4 hover:bg-grey w-full pl-8 py-3"
          onClick={signOut}
        >
          <h1 className="font-bold text-xl mb-1">Sign Out</h1>
          <p className="text-dark-grey">@{username}</p>
        </button>
      </div>
    </AnimationWrapper>
  );
};

export default UserNavigationPanel;
