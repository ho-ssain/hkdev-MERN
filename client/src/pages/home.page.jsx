/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";

import InPageNavigation, { activeTabRef } from "../components/InPageNavigation";
import axios from "axios";
import Loader from "../components/Loader";
import BlogPost from "../components/BlogPost";
import MinimalBlogPost from "../components/NoBannerBlogPost";
import NoDataMessage from "../components/NoData";
import FilterPaginationData from "../common/FilterPaginationData";
import LoadMoreDataBtn from "../components/LoadMore";
import AnimationWrapper from "../common/Page-animation";

const Home = () => {
  let [blogs, setBlogs] = useState(null);
  let [trending_blogs, setTrendingBlogs] = useState(null);
  let [pageSate, setPageState] = useState("home");

  let categories = [
    "javascript",
    "node",
    "express",
    "mongodb",
    "react",
    "next",
    "vs code",
    "git",
    "html",
    "css",
    "tailwind",
    "typescript",
    "dsa with js",
    "web programming",
    "web architecture",
    "js testing",
    "api",
    "web",
  ];

  const fetchLatestBlogs = ({ page = 1 }) => {
    axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + "/latest-blogs", { page })
      .then(async ({ data }) => {
        console.log(data.blogs);

        let formattedData = await FilterPaginationData({
          state: blogs,
          data: data.blogs,
          page,
          countRoute: "/all-latest-blogs-count",
        });
        console.log(formattedData);
        setBlogs(formattedData);
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

  const loadBlogByCategory = (e) => {
    let category = e.target.innerText.toLowerCase();
    setBlogs(null);
    if (pageSate === category) {
      setPageState("home");
      return;
    }
    setPageState(category);
  };

  const fetchBlogsCategory = ({ page = 1 }) => {
    axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + "/search-blogs", {
        tag: pageSate,
        page,
      })
      .then(async ({ data }) => {
        let formattedData = await FilterPaginationData({
          state: blogs,
          data: data.blogs,
          page,
          countRoute: "/search-blogs-count",
          data_to_send: { tag: pageSate },
        });
        setBlogs(formattedData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    activeTabRef.current.click();

    if (pageSate === "home") {
      fetchLatestBlogs({ page: 1 });
    } else {
      fetchBlogsCategory({ page: 1 });
    }

    if (!trending_blogs) {
      fetchTrendingBlogs();
    }
  }, [pageSate]);

  return (
    <AnimationWrapper>
      <section className="h-cover flex justify-center gap-10">
        {/* blogs  */}

        <div className="w-full">
          <InPageNavigation
            routes={[pageSate, "trending blogs"]}
            defaultHidden={["trending blogs"]}
          >
            <>
              {
                // Latest blogs
                blogs === null ? (
                  <Loader />
                ) : blogs.results.length ? (
                  blogs.results.map((blog, i) => {
                    return (
                      <AnimationWrapper
                        key={i}
                        transition={{ duration: 1, delay: i * 0.2 }}
                      >
                        <BlogPost
                          content={blog}
                          author={blog.author.personal_info}
                        />
                      </AnimationWrapper>
                    );
                  })
                ) : (
                  <NoDataMessage message="No Blogs Published!" />
                )
              }

              <LoadMoreDataBtn
                state={blogs}
                fetchData={
                  pageSate === "home" ? fetchLatestBlogs : fetchBlogsCategory
                }
              />
            </>

            <>
              {
                // trending blogs
                trending_blogs === null ? (
                  <Loader />
                ) : trending_blogs.length ? (
                  trending_blogs.map((blog, i) => {
                    return (
                      <AnimationWrapper
                        key={i}
                        transition={{ duration: 1, delay: i * 0.2 }}
                      >
                        <MinimalBlogPost blog={blog} index={i} />
                      </AnimationWrapper>
                    );
                  })
                ) : (
                  <NoDataMessage message="No Trending Blogs Found!" />
                )
              }
            </>
          </InPageNavigation>
        </div>

        {/* filters and trending blogs  */}

        <div className="min-w-[40%] lg:min-w-[400px] max-w-min border-l border-grey pl-8 pt-3 max-md:hidden">
          <div className="flex flex-col gap-10">
            <div>
              <h1 className="font-medium text-xl mb-8">
                Stories from all interests
              </h1>

              <div className="flex gap-3 flex-wrap">
                {categories.map((category, i) => {
                  return (
                    <button
                      key={i}
                      className={
                        "tag " +
                        (pageSate === category ? "bg-black text-white" : "")
                      }
                      onClick={loadBlogByCategory}
                    >
                      {category}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <h1 className="font-medium text-xl mb-8">
                Trending <i className="fi fi-rr-arrow-trend-up"></i>
              </h1>

              {
                // trending blogs
                trending_blogs === null ? (
                  <Loader />
                ) : trending_blogs.length ? (
                  trending_blogs.map((blog, i) => {
                    return (
                      <AnimationWrapper
                        key={i}
                        transition={{ duration: 1, delay: i * 0.2 }}
                      >
                        <MinimalBlogPost blog={blog} index={i} />
                      </AnimationWrapper>
                    );
                  })
                ) : (
                  <NoDataMessage message="No Trending Blog Found!" />
                )
              }
            </div>
          </div>
        </div>
      </section>
    </AnimationWrapper>
  );
};

export default Home;
