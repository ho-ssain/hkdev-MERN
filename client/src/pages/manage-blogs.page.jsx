/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../App";
import axios from "axios";
import FilterPaginationData from "../common/filter-pagination-data";
import { Toaster } from "react-hot-toast";
import InPageNavigation from "../components/inpage-navigation.component";
import Loader from "../components/loader.component";
import NoDataMessage from "../components/nodata.component";
import AnimationWrapper from "../common/page-animation";
import {
  ManageDraftsBlogCard,
  ManagePublishBlogCard,
} from "../components/manage-blogcard.component";
import LoadMoreDataBtn from "../components/load-more.component";
import { useSearchParams } from "react-router-dom";

const ManageBlogs = () => {
  const [blogs, setBlogs] = useState(null);
  const [drafts, setDrafts] = useState(null);
  const [query, setQuery] = useState("");
  let { userAuth: { accessToken } = {} } = useContext(UserContext);

  let activeTab = useSearchParams()[0].get("tab");

  const getBlogs = ({ page, draft, deletedDocCount = 0 }) => {
    axios
      .post(
        import.meta.env.VITE_SERVER_DOMAIN + "/user-written-blogs",
        {
          page,
          draft,
          query,
          deletedDocCount,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      .then(async ({ data }) => {
        let formattedData = await FilterPaginationData({
          state: draft ? drafts : blogs,
          data: data.blogs,
          page,
          user: accessToken,
          countRoute: "/user-written-blogs-count",
          data_to_send: { draft, query },
        });

        console.log(formattedData);

        if (draft) {
          setDrafts(formattedData);
        } else {
          setBlogs(formattedData);
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (accessToken) {
      if (blogs === null) {
        getBlogs({ page: 1, draft: false });
      }

      if (drafts == null) {
        getBlogs({ page: 1, draft: true });
      }
    }
  }, [accessToken, drafts, blogs, query]);

  const handleChange = (e) => {
    let searchQuery = e.target.value;
    setQuery(searchQuery);
    if (e.keyCode === 13 && searchQuery.length) {
      setBlogs(null);
      setDrafts(null);
    }
  };

  const handleSearch = (e) => {
    if (!e.target.value.length) {
      setQuery("");
      setBlogs(null);
      setDrafts(null);
    }
  };

  return (
    <>
      <h1 className="max-md:hidden text-black">Manage Blogs</h1>

      <Toaster />

      <div className="relative max-md:mt-7 md:mt-8 mb-10">
        <input
          type="search"
          className="w-full bg-grey p-3 pl-12 pr-6 rounded-full placeholder:text-dark-grey"
          placeholder="Search Blogs"
          onChange={handleChange}
          onKeyDown={handleSearch}
        />

        <i className="fi fi-rr-search absolute right-[10%] md:pointer-events-none md:left-5 top-1/2 -translate-y-1/2 text-xl text-dark-grey"></i>
      </div>

      <InPageNavigation
        routes={["Published Blogs", "Drafts"]}
        defaultActiveIndex={activeTab !== "draft" ? 0 : 1}
      >
        {
          // published blogs
          blogs === null ? (
            <Loader />
          ) : blogs.results.length ? (
            <>
              {blogs.results.map((blog, i) => {
                return (
                  <AnimationWrapper key={i} transition={{ delay: i * 0.04 }}>
                    <ManagePublishBlogCard
                      blog={{ ...blog, index: i, setStateFunc: setBlogs }}
                    />
                  </AnimationWrapper>
                );
              })}

              <LoadMoreDataBtn
                state={blogs}
                fetchData={getBlogs}
                additionalParam={{
                  draft: false,
                  deletedDocCount: blogs.deletedDocCount,
                }}
              />
            </>
          ) : (
            <NoDataMessage message="No Published blogs" />
          )
        }

        {
          // draft blogs
          drafts === null ? (
            <Loader />
          ) : drafts.results.length ? (
            <>
              {drafts.results.map((draft, i) => {
                return (
                  <AnimationWrapper key={i} transition={{ delay: i * 0.04 }}>
                    <ManageDraftsBlogCard
                      blog={{ ...draft, index: i, setStateFunc: setDrafts }}
                    />
                  </AnimationWrapper>
                );
              })}

              <LoadMoreDataBtn
                state={drafts}
                fetchData={getBlogs}
                additionalParam={{
                  draft: true,
                  deletedDocCount: drafts.deletedDocCount,
                }}
              />
            </>
          ) : (
            <NoDataMessage message="No drafts found...." />
          )
        }
      </InPageNavigation>
    </>
  );
};

export default ManageBlogs;
