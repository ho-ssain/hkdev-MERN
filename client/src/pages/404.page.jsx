import { Link } from "react-router-dom";
import page404 from "../assets/404.png";
import logo from "../assets/logo.png";

const PageNotFound = () => {
  return (
    <section className="h-cover relative p-10 flex flex-col items-center gap-20 text-center">
      <img
        src={page404}
        alt="404"
        className="select-none border-2 border-grey w-72 aspect-square object-cover rounded"
      />

      <h1 className="text-4xl font-gelasio leading-7">Page not found!</h1>

      <p className="text-dark-grey text-xl leading-7 -mt-8">
        The page you are looking for does not exist. Head back to the --&gt;
        <Link to="/" className="text-purple underline">
          Home
        </Link>
      </p>

      <div className="mt-auto">
        <img
          src={logo}
          alt="logo"
          className="h-8 object-contain block mx-auto select-none"
        />
        <p className="mt-5 text-dark-grey">
          Read millions of stories about the Software Engineering World!
        </p>
      </div>
    </section>
  );
};

export default PageNotFound;
