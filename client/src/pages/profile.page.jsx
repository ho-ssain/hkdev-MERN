/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import AnimationWrapper from "../common/Page-animation";
import Loader from "../components/Loader";
import { UserContext } from "../App";
import About from "../components/About";
import FilterPaginationData from "../common/FilterPaginationData";
import InPageNavigation from "../components/InPageNavigation";
import BlogPost from "../components/BlogPost";
import NoDataMessage from "../components/NoData";
import LoadMoreDataBtn from "../components/LoadMore";
import PageNotFound from "./404.page";

export const profileDataStructure = {
  personal_info: {
    fullname: "",
    username: "",
    profile_img: "",
    bio: "",
  },
  account_info: {
    total_posts: 0,
    total_reads: 0,
  },
  social_links: {},
  joinedAt: " ",
};

const Profile = () => {
  let { id: profileId } = useParams();
  let [profile, setProfile] = useState(profileDataStructure);
  let [loading, setLoading] = useState(true);
  let [blogs, setBlog] = useState(null);
  let [profileLoaded, setProfileLoaded] = useState("");

  let { userAuth: { username } = {} } = useContext(UserContext);

  let {
    personal_info: { fullname, username: profile_username, profile_img, bio },
    account_info: { total_posts, total_reads },
    social_links,
    joinedAt,
  } = profile;

  const fetchUserProfile = () => {
    axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + "/get-profile", {
        username: profileId,
      })
      .then(({ data: user }) => {
        if (user !== null) {
          setProfile(user);
        }
        setProfileLoaded(profileId);
        getBlogs({ user_id: user._id });
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const getBlogs = ({ page = 1, user_id } = {}) => {
    user_id =
      user_id === undefined ? (blogs ? blogs.user_id : undefined) : user_id;
    axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + "/search-blogs", {
        author: user_id,
        page,
      })
      .then(async ({ data }) => {
        let formattedDate = await FilterPaginationData({
          state: blogs,
          data: data.blogs,
          page,
          countRoute: "/search-blogs-count",
          data_to_send: { author: user_id },
        });

        formattedDate.user_id = user_id;
        // console.log(formattedDate);
        setBlog(formattedDate);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (profileId !== profileLoaded) {
      setBlog(null);
    }

    if (blogs === null) {
      resetStates();
      fetchUserProfile();
    }
  }, [profileId, blogs]);

  const resetStates = () => {
    setProfile(profileDataStructure);
    setLoading(true);
    setProfileLoaded("");
  };

  return (
    <AnimationWrapper>
      {loading ? (
        <Loader />
      ) : profile_username.length ? (
        <section className="h-cover md:flex flex-row-reverse items-start gap-5 min-[1100px]:gap-12">
          <div className="flex flex-col max-md:items-center gap-5 min-w-[250px] md:w-[50%] md:pl-8 md:border-1 border-grey md:sticky md:top-[100px] md:py-10">
            <img
              src={profile_img}
              alt="profile_img"
              className="w-48 h-48 bg-grey rounded-full md:w-32 md:h-32"
            />

            <h1 className="text-2xl font-medium">{profile_username}</h1>

            <p className="text-xl capitalize h-6"> {fullname} </p>

            <p>
              {total_posts.toLocaleString()} Blogs -{" "}
              {total_reads.toLocaleString()} Reads{" "}
            </p>

            <div className="flex gap-4 mt-2">
              {
                //......
                profileId === username ? (
                  <Link
                    to="/settings/edit-profile"
                    className="btn-light rounded-md"
                  >
                    Edit profile
                  </Link>
                ) : (
                  ""
                )
              }
            </div>

            <About
              bio={bio}
              social_links={social_links}
              joinedAt={joinedAt}
              className="max-md:hidden"
            />
          </div>

          <div className="max-md:mt-12 w-full">
            <InPageNavigation
              routes={["Blogs published", "About"]}
              defaultHidden={["About"]}
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

                <LoadMoreDataBtn state={blogs} fetchData={getBlogs} />
              </>

              <>
                <About
                  bio={bio}
                  social_links={social_links}
                  joinedAt={joinedAt}
                />
              </>
            </InPageNavigation>
          </div>
        </section>
      ) : (
        <PageNotFound />
      )}
    </AnimationWrapper>
  );
};

export default Profile;
