/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useContext, useEffect } from "react";
import { BlogContext } from "../pages/blog.page";
import { Link } from "react-router-dom";
import { UserContext } from "../App";
import { Toaster, toast } from "react-hot-toast";
import axios from "axios";

const BlogInteraction = () => {
  let {
    blog,
    blog: {
      _id,
      title,
      blog_id,
      activity,
      activity: { total_likes, total_comments },
      author: {
        personal_info: { username: author_username },
      },
    },
    setBlog,
    isLikeByUser,
    setLikeByUser,
    setCommentWrapper,
  } = useContext(BlogContext);

  let {
    userAuth: { username, accessToken },
  } = useContext(UserContext);

  const handleLike = () => {
    if (accessToken) {
      // console.log("liked");
      setLikeByUser((preVal) => !preVal);

      !isLikeByUser ? total_likes++ : total_likes--;

      setBlog({ ...blog, activity: { ...activity, total_likes } });

      axios
        .post(
          import.meta.env.VITE_SERVER_DOMAIN + "/like-blog",
          {
            _id,
            isLikeByUser,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )
        .then(({ data }) => {
          console.log(data);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      toast.error("Please login to like this blog!");
    }
  };

  useEffect(() => {
    if (accessToken) {
      // make request to severs for the like information
      axios
        .post(
          import.meta.env.VITE_SERVER_DOMAIN + "/isliked-by-user",
          { _id },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )
        .then(({ data: { result } }) => {
          setLikeByUser(Boolean(result));
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);

  return (
    <>
      <Toaster />
      <hr className="border-grey my-2" />

      <div className="flex gap-6 justify-between">
        {/* //...................  */}
        <div className="flex gap-5 items-center">
          <button
            className={
              "w-10 h-10 rounded-full flex items-center justify-center " +
              (isLikeByUser ? "bg-red/20 text-red" : "bg-grey/80")
            }
            onClick={handleLike}
          >
            <i
              className={"fi " + (isLikeByUser ? "fi-sr-heart" : "fi-rr-heart")}
            ></i>
          </button>
          <p className="text-xl text-dark-grey">{total_likes} </p>

          <button
            className="w-10 h-10 rounded-full flex items-center justify-center bg-grey/80"
            onClick={() => setCommentWrapper((preVal) => !preVal)}
          >
            <i className="fi fi-rr-comment-dots"></i>
          </button>
          <p className="text-xl text-dark-grey">{total_comments} </p>
        </div>

        {/* //...................  */}
        <div className="flex gap-6 items-center">
          {
            //..............
            username === author_username ? (
              <Link
                to={`/editor/${blog_id}`}
                className="underline hover:text-purple"
              >
                Edit
              </Link>
            ) : (
              ""
            )
          }

          <Link
            to={`http://twitter.com/intent/tweet?text=Read ${title}&url=${location.href}`}
            target="_blank"
          >
            <i className="fi fi-brands-twitter text-xl hover:text-twitter"></i>
          </Link>
        </div>
      </div>

      <hr className="border-grey my-2" />
    </>
  );
};

export default BlogInteraction;
