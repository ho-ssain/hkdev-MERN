/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-unused-vars */

import { useContext } from "react";
import { BlogContext } from "../pages/blog.page";
import CommentField from "./comment-field.component";
import axios from "axios";
import AnimationWrapper from "../common/page-animation";
import NoDataMessage from "./nodata.component";
import CommentCard from "./comment-card.component";

export const fetchComments = async ({
  skip = 0,
  blog_id,
  setParentCommentCountFun,
  comment_array = null,
}) => {
  let res;

  await axios
    .post(import.meta.env.VITE_SERVER_DOMAIN + "/get-blog-comments", {
      blog_id,
      skip,
    })
    .then(({ data }) => {
      data.map((comment) => {
        comment.childrenLevel = 0;
      });
      setParentCommentCountFun((preVal) => preVal + data.length);

      if (comment_array === null) {
        res = { results: data };
      } else {
        res = { results: [...comment_array, ...data] };
      }
    });
  return res;
};

const CommentsContainer = () => {
  const {
    blog,
    blog: {
      _id,
      title,
      comments: { results: commentsArr },
      activity: { total_parent_comments },
    },
    setBlog,
    commentWrapper,
    setCommentWrapper,
    totalParentCommentsLoaded,
    setTotalParentCommentsLoaded,
  } = useContext(BlogContext);

  // console.log(commentsArr);

  // console.log("totalParentCommentsLoaded -: " + totalParentCommentsLoaded);
  // console.log(total_parent_comments);

  const loadMoreComments = async () => {
    let newcommentsArr = await fetchComments({
      skip: totalParentCommentsLoaded,
      blog_id: _id,
      setParentCommentCountFun: setTotalParentCommentsLoaded,
      comment_array: commentsArr,
    });

    setBlog({ ...blog, comments: newcommentsArr });
  };

  return (
    <div
      className={
        "max-sm:w-full fixed " +
        (commentWrapper ? "top-0 sm:right-0" : "top-[100%] sm:right-[-100%]") +
        " duration-700 max-sm:right-0 sm:top-0 w-[30%] min-w-[350px] h-full z-50 bg-white shadow-2xl p-8 px-16 overflow-y-auto overflow-x-hidden"
      }
    >
      <div className="relative">
        <h1 className="text-xl font-medium">Comments</h1>
        <p className="text-lg mt-2 w-[70%] text-dark-grey line-clamp-1">
          {title}
        </p>

        <button
          className="absolute top-0 right-0 flex justify-center items-center w-10 h-10 rounded-full bg-grey"
          onClick={() => setCommentWrapper((preVal) => !preVal)}
        >
          <i className="fi fi-br-cross text-xl mt-1"></i>
        </button>
      </div>

      <hr className="border-grey my-8 w-[120%] -ml-10" />

      <CommentField action="comment" />

      {
        //..................
        commentsArr && commentsArr.length ? (
          commentsArr.map((comment, i) => {
            return (
              <AnimationWrapper key={i}>
                <CommentCard
                  index={i}
                  leftVal={comment.childrenLevel * 4}
                  commentData={comment}
                />
              </AnimationWrapper>
            );
          })
        ) : (
          <NoDataMessage message="No Comment" />
        )
      }

      {
        //...........
        total_parent_comments > totalParentCommentsLoaded ? (
          <button
            className="text-dark-grey p-2 px-3 hover:bg-grey/30 rounded-md flex items-center gap-2"
            onClick={loadMoreComments}
          >
            Load More...
          </button>
        ) : (
          ""
        )
      }
    </div>
  );
};

export default CommentsContainer;
