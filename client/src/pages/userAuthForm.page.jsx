/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */

import Input from "../components/input/input.component";
import google from "../assets/sm-icon/google.png";
import { Link } from "react-router-dom";
import PageAnimation from "../common/page.animation";
const UserAuthForm = ({ type }) => {
  return (
    <PageAnimation keyValue={type}>
      <section className="h-cover flex items-center justify-center">
        <form className="w-[80%] max-w-[400px]">
          <h1 className="text-3xl font-gelasio capitalize text-center mb-24">
            {type === "sign-in" ? "Welcome Back!🙂" : "Join Us Today!"}
          </h1>

          {type !== "sign-in" ? (
            <Input
              name="fullname"
              type="text"
              placeholder="Full name"
              icon="fi-rr-user"
            />
          ) : (
            ""
          )}

          <Input
            name="email"
            type="email"
            placeholder="Email"
            icon="fi-rr-envelope"
          />

          <Input
            name="password"
            type="password"
            placeholder="Password"
            icon="fi-rr-key"
          />

          <button className="btn-dark center mt-14" type="submit">
            {type.replace("-", " ")}
          </button>

          <div className="relative w-full flex items-center gap-2 my-10 opacity-10 uppercase text-black font-bold">
            <hr className="w-1/2 border-black" />
            <p>or</p>
            <hr className="w-1/2 border-black" />
          </div>

          {/* google icon  */}
          <button className="btn-dark flex items-center justify-center gap-4 w-[90%] center">
            <img src={google} alt="google" className="w-5" />
            continue with google
          </button>

          {type === "sign-in" ? (
            <p className="mt-6 text-dark-grey text-xl text-center">
              Don't have an account ?
              <Link to="/signup" className="underline text-black text-xl ml-1">
                Join us today
              </Link>
            </p>
          ) : (
            <p className="mt-6 text-dark-grey text-xl text-center">
              Already a member ?
              <Link to="/signin" className="underline text-black text-xl ml-1">
                Sign in here
              </Link>
            </p>
          )}
        </form>
      </section>
    </PageAnimation>
  );
};

export default UserAuthForm;
