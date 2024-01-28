/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import AnimationWrapper from "../common/page-animation";
import InPageNavigation from "../components/InPageNavigation";
import axios from "axios";
import Loader from "../components/Loader";
import BlogPost from "../components/BlogPost";

const Home = () => {
  let [blogs, setBlogs] = useState(null);
  let [trending_blogs, setTrendingBlogs] = useState(null);

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

  const fetchTrendingBlogs = () => {
    axios
      .get(import.meta.env.VITE_SERVER_DOMAIN + "/trending-blogs")
      .then(({ data }) => {
        setTrendingBlogs(data.blogs);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetchLatestBlogs();
    fetchTrendingBlogs();
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
                  return (
                    <AnimationWrapper
                      key={i}
                      transition={{ duration: 1, delay: i * 1 }}
                    >
                      <BlogPost
                        content={blog}
                        author={blog.author.personal_info}
                      />
                    </AnimationWrapper>
                  );
                })
              )}
            </>

            <>
              {trending_blogs === null ? (
                <Loader />
              ) : (
                trending_blogs.map((blog, i) => {
                  return (
                    <AnimationWrapper
                      key={i}
                      transition={{ duration: 1, delay: i * 1 }}
                    >
                      {/* <BlogPost
                        content={blog}
                        author={blog.author.personal_info}
                      /> */}
                    </AnimationWrapper>
                  );
                })
              )}
            </>
          </InPageNavigation>
        </div>

        {/* Editors and trending blogs  */}
        <div></div>
      </section>
    </AnimationWrapper>
  );
};

export default Home;
