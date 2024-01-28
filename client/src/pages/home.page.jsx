/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import AnimationWrapper from "../common/page-animation";
import InPageNavigation from "../components/InPageNavigation";
import axios from "axios";
import Loader from "../components/Loader";

const Home = () => {
  let [blogs, setBlogs] = useState(null);

  const fetchLatestBlogs = () => {
    axios
      .get(import.meta.env.VITE_SERVER_DOMAIN + "/latest-blogs")
      .then(({ data }) => {
        setBlogs(data.blogs);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetchLatestBlogs();
  }, []);

  return (
    <AnimationWrapper>
      <section className="h-cover flex justify-center gap-10">
        {/* Latest blogs  */}

        <div className="w-full">
          <InPageNavigation
            routes={["home", "trending blogs"]}
            defaultHidden={["trending blogs"]}
          >
            <>
              {blogs === null ? (
                <Loader />
              ) : (
                blogs.map((blog, i) => {
                  return <h1 key={i}>{blog.title}</h1>;
                })
              )}
            </>
            <h1>Trending Blogs here</h1>
          </InPageNavigation>
        </div>

        {/* Editors and trending blogs  */}
        <div></div>
      </section>
    </AnimationWrapper>
  );
};

export default Home;
