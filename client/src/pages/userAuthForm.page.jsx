/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

import { Toaster, toast } from "react-hot-toast";
import axios from "axios";
import { storeInSession } from "../common/session";
import { useContext, useRef } from "react";
import { UserContext } from "../App";
// import { authWithGoogle } from "../common/Firebase";

import { Link, Navigate } from "react-router-dom";
import Input from "../components/input.component";
import googleIcon from "../assets/google.png";
import AnimationWrapper from "../common/page-animation";
import { authWithGoogle } from "../common/firebase";

const UserAuthForm = ({ type }) => {
  // const authForm = useRef();

  let { userAuth: { accessToken } = { accessToken: null }, setUserAuth } =
    useContext(UserContext);

  // console.log(accessToken); (for debugging purpose)
  //........................................

  const handleSubmit = (e) => {
    e.preventDefault();

    let serverRoute = type === "sign-in" ? "/signin" : "/signup";

    let emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/; // regex for email
    let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

    // formData
    let form = new FormData(authForm);

    let formData = {};

    for (const [key, value] of form.entries()) {
      formData[key] = value;
    }

    // console.log(formData); (for debugging purpose)

    // form validation.......
    let { fullname, email, password } = formData;

    if (fullname) {
      if (fullname.length < 3) {
        return toast.error("Fullname must be at least 3 letters long!");
      }
    }

    if (!email) {
      return toast.error("Enter email!");
    }
    if (!emailRegex.test(email)) {
      return toast.error("Email is Invalid!");
    }
    if (!passwordRegex.test(password)) {
      return toast.error(
        "Password should be 6 to 20 characters long with a numeric, 1 lowercase and 1 uppercase letters!"
      );
    }

    // sending data to backend
    userAuthThroughServer(serverRoute, formData);
  };

  //.......................................

  const userAuthThroughServer = async (serverRoute, formData) => {
    await axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + serverRoute, formData)
      .then(({ data }) => {
        // (for debugging purpose)
        // console.log(data);

        storeInSession("user", JSON.stringify(data));
        setUserAuth(data);
      })
      .catch(({ response }) => {
        toast.error(response.data.error);
      });
  };

  //.......................................

  const handleGoogleAuth = async (e) => {
    e.preventDefault();

    await authWithGoogle()
      .then((user) => {
        // console.log(user);

        let serverRoute = "/google-auth";
        let formData = {
          accessToken: user.accessToken,
        };
        userAuthThroughServer(serverRoute, formData);
      })
      .catch((err) => {
        toast.error("trouble login through google! 😓");
        return console.log(err);
      });
  };

  return accessToken ? (
    <Navigate to="/" />
  ) : (
    <AnimationWrapper keyValue={type}>
      <Toaster />
      <section className="h-cover flex items-center justify-center">
        <form id="authForm" className="w-[80%] max-w-[400px]">
          <h1 className="text-3xl font-gelasio text-center mb-20">
            {type === "sign-in"
              ? "Debugging Dreams: Welcome Back!"
              : "Join hkDev"}
          </h1>

          {type !== "sign-in" ? (
            <Input
              name="fullname"
              type="text"
              placeholder="Full-name"
              icon="fi-ss-user-pen"
            />
          ) : null}

          <Input
            name="email"
            type="email"
            placeholder="Email"
            icon="fi-sr-envelope"
          />

          <Input
            name="password"
            type="password"
            placeholder="Password"
            icon="fi-sr-lock"
          />

          <button
            className="btn-dark center mt-14 py-1.5"
            type="submit"
            onClick={handleSubmit}
          >
            {type.replace("-", " ")}
          </button>

          <div className="relative w-full flex items-center gap-2 my-10 opacity-20 uppercase text-black font-bold">
            <hr className="w-1/2 border-black" />
            <p>or</p>
            <hr className="w-1/2 border-black" />
          </div>

          <button
            className="btn-dark flex items-center justify-center gap-4 w-[90%] center py-2"
            onClick={handleGoogleAuth}
          >
            <img src={googleIcon} alt="google" className="w-5" /> Continue With
            Google
          </button>

          {type === "sign-in" ? (
            <p className="mt-6 text-dark-grey text-xl text-center">
              Don&apos;t have an account ?
              <Link
                to="/signup"
                className="underline text-purple text-xl ml-1 font-bold"
              >
                Join Us.
              </Link>
            </p>
          ) : (
            <p className="mt-6 text-dark-grey text-xl text-center">
              Already a member ?
              <Link
                to="/signin"
                className="underline text-purple text-xl ml-1 font-bold"
              >
                Sign in here.
              </Link>
            </p>
          )}
        </form>
      </section>
    </AnimationWrapper>
  );
};

export default UserAuthForm;
