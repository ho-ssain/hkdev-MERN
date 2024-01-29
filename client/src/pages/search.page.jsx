/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useParams } from "react-router-dom";
import InPageNavigation from "../components/InPageNavigation";
import LoadMoreDataBtn from "../components/LoadMore";
import AnimationWrapper from "../common/page-animation";
import { useEffect, useState } from "react";
import Loader from "../components/Loader";
import BlogPost from "../components/BlogPost";
import NoDataMessage from "../components/NoData";
import axios from "axios";
import FilterPaginationData from "../common/FilterPaginationData";

const Search = () => {
  let { query } = useParams();
  let [blogs, setBlogs] = useState(null);

  const searchBlogs = ({ page = 1, create_new_arr = false }) => {
    axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + "/search-blogs", {
        query,
        page,
      })
      .then(async ({ data }) => {
        let formattedData = await FilterPaginationData({
          state: blogs,
          data: data.blogs,
          page,
          countRoute: "/search-blogs-count",
          data_to_send: { query },
          create_new_arr,
        });

        setBlogs(formattedData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const resetState = () => {
    setBlogs(null);
  };

  useEffect(() => {
    resetState();
    searchBlogs({ page: 1, create_new_arr: true });
  }, [query]);

  return (
    <section className="h-cover flex justify-center gap-10">
      <div className="w-full">
        <InPageNavigation
          routes={[`Search Results for ${query}`, "Accounts Matched"]}
          defaultHidden={["Accounts Matched"]}
        >
          <>
            {blogs === null ? (
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
            )}
            <LoadMoreDataBtn
              state={blogs}
              fetchData={searchBlogs}
            ></LoadMoreDataBtn>
          </>
        </InPageNavigation>
      </div>
    </section>
  );
};

export default Search;
