/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */

import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { createContext, useEffect, useState } from "react";
import AnimationWrapper from "../common/page-animation";
import Loader from "../components/Loader";
import { getDay } from "../common/date";
import BlogInteraction from "../components/BlogInteraction";
import BlogPost from "../components/BlogPost";
import BlogContent from "../components/BlogContent";

export const blogStructure = {
  title: "",
  des: "",
  count: [],
  author: { personal_info: {} },
  banner: "",
  publishedAt: "",
};

export const BlogContext = createContext({});

const Blog = () => {
  let { blog_id } = useParams();
  const [blog, setBlog] = useState(blogStructure);
  const [similarBlog, setSimilarBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLikeByUser, setLikeByUser] = useState(false);

  let {
    title,
    content,
    banner,
    author: {
      personal_info: { fullname, username: author_username, profile_img },
    },
    publishedAt,
  } = blog;

  const fetchBlog = () => {
    axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + "/get-blog", { blog_id })
      .then(({ data: { blog } }) => {
        setBlog(blog);

        axios
          .post(import.meta.env.VITE_SERVER_DOMAIN + "/search-blogs", {
            tag: blog.tags[0],
            limit: 6,
            element_blog: blog_id,
          })
          .then(({ data }) => {
            setSimilarBlog(data.blogs);
            // console.log(data.blogs);
          })
          .catch();

        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    resetState();
    fetchBlog();
  }, [blog_id]);

  const resetState = () => {
    setBlog(blogStructure);
    setSimilarBlog(null);
    setLoading(true);
  };

  return (
    <AnimationWrapper>
      {loading ? (
        <Loader />
      ) : (
        <BlogContext.Provider
          value={{ blog, setBlog, isLikeByUser, setLikeByUser }}
        >
          <div className="max-w-[900px] center py-10 max-lg:px-[5vw]">
            {/* ................................................  */}
            <img src={banner} alt="banner" className="aspect-video" />

            {/* ................................................. */}
            <div className="mt-12">
              <h2>{title}</h2>

              <div className="flex max-sm:flex-col justify-between my-8">
                <div className="flex gap-5 items-start">
                  <img
                    src={profile_img}
                    alt=""
                    className="w-12 h-12 rounded-full"
                  />
                  <p className="capitalize">
                    {fullname}
                    <br />@
                    <Link to={`/user/${author_username}`} className="underline">
                      {author_username}
                    </Link>
                  </p>
                </div>
                <p className="text-dark-grey opacity-75 max-sm:mt-6 max-sm:ml-12 max-sm:pl-5">
                  Published on {getDay(publishedAt)}
                </p>
              </div>
            </div>

            {/* ................................................. */}
            <BlogInteraction />

            <div className="my-12 font-gelasio blog-page-content">
              {content[0].blocks.map((block, i) => {
                return (
                  <div key={i} className="my-4 md:my-8">
                    <BlogContent block={block} />
                  </div>
                );
              })}
            </div>

            <BlogInteraction />

            {
              //....................................
              similarBlog !== null && similarBlog.length ? (
                <>
                  <h1 className="text-2xl mt-14 mb-10 font-medium">
                    Similar Blogs
                  </h1>
                  {similarBlog.map((blog, i) => {
                    let {
                      author: { personal_info },
                    } = blog;

                    return (
                      <AnimationWrapper
                        key={i}
                        transition={{ duration: 1, delay: i * 0.5 }}
                      >
                        <BlogPost content={blog} author={personal_info} />
                      </AnimationWrapper>
                    );
                  })}
                </>
              ) : (
                ""
              )
            }
          </div>
        </BlogContext.Provider>
      )}
    </AnimationWrapper>
  );
};

export default Blog;
