/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */

import Input from "../components/input/input.component";
import google from "../assets/sm-icon/google.png";
import { Link } from "react-router-dom";
import PageAnimation from "../common/page.animation";
import { useContext, useRef } from "react";
import { Toaster, toast } from "react-hot-toast";
import axios from "axios";
import { storeInSession } from "../common/Session";

const UserAuthForm = ({ type }) => {
  // using ref hook for accessing the form element.
  const authForm = useRef();

  let { userAuth: { accessToken } = { accessToken: null }, setUserAuth } =
    useContext(UserContext);

  // user authentication through server
  const userAuthThroughServer = (serverRoute, formData) => {
    axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + serverRoute, formData)
      .then(({ data }) => {
        storeInSession("user", JSON.stringify(data));
        setUserAuth(data);
      })
      .catch(({ response }) => {
        toast.error(response.data.error);
      });
  };

  // handling the SIgn-in/Sign-Up button
  const handleSubmit = (e) => {
    e.preventDefault();
    let serverRoute = type === "sign-in" ? "/signin" : "/signup";

    // regex for email
    let emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

    // regex for password
    let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;

    // retrieve the form-data
    let form = new FormData(authForm.current);
    let formData = {};
    for (let [key, value] of form.entries()) {
      formData[key] = value;
    }

    // console.log(formData);

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
    userAuthThroughServer(serverRoute, formData);
  };

  return (
    <PageAnimation keyValue={type}>
      <section className="h-cover flex items-center justify-center">
        <Toaster />
        <form ref={authForm} className="w-[80%] max-w-[400px]">
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

          <button
            className="btn-dark center mt-14"
            type="submit"
            onClick={handleSubmit}
          >
            {type.replace("-", " ")}
          </button>

          {/* ------------------------------------------  */}

          <div className="relative w-full flex items-center gap-2 my-10 opacity-10 uppercase text-black font-bold">
            <hr className="w-1/2 border-black" />
            <p>or</p>
            <hr className="w-1/2 border-black" />
          </div>

          {/* google icon  */}
          <button className="btn-dark flex items-center justify-center gap-4 w-[90%] center">
            <img src={google} alt="google" className="w-5" /> continue with
            google
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
