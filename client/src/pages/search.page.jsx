/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useParams } from "react-router-dom";
import InPageNavigation from "../components/inpage-navigation.component";
import LoadMoreDataBtn from "../components/load-more.component";
import AnimationWrapper from "../common/page-animation";
import { useEffect, useState } from "react";
import Loader from "../components/loader.component";
import BlogPost from "../components/blog-post.component";
import NoDataMessage from "../components/nodata.component";
import axios from "axios";
import FilterPaginationData from "../common/filter-pagination-data";
import UserCard from "../components/usercard.component";

const Search = () => {
  let { query } = useParams();
  let [blogs, setBlogs] = useState(null);
  let [users, setUsers] = useState(null);

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

  const fetchUsers = () => {
    axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + "/search-users", { query })
      .then(({ data: { users } }) => {
        setUsers(users);
      });
  };

  const resetState = () => {
    setBlogs(null);
    setUsers(null);
  };

  useEffect(() => {
    resetState();
    searchBlogs({ page: 1, create_new_arr: true });
    fetchUsers();
  }, [query]);

  const UserCardWrapper = () => {
    return (
      <>
        {
          //.............
          users === null ? (
            <Loader />
          ) : users.length ? (
            users.map((user, i) => {
              return (
                <AnimationWrapper
                  key={i}
                  transition={{ duration: 1, delay: i * 0.1 }}
                >
                  <UserCard user={user} />
                </AnimationWrapper>
              );
            })
          ) : (
            <NoDataMessage message="No User Found!" />
          )
        }
      </>
    );
  };

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
                    transition={{ duration: 1, delay: i * 0.1 }}
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

          <UserCardWrapper />
        </InPageNavigation>
      </div>

      <div className="min-w-[40%] lg:min-w-[350px] max-w-min bottom-1 border-grey pl-8 pt-3 max-md:hidden">
        <h1 className="font-medium text-xl mb-8">
          User related to search
          <i className="fi fi-rr-user mt-1 ml-1"></i>
        </h1>
        <UserCardWrapper />
      </div>
    </section>
  );
};

export default Search;
