/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import { useContext, useState } from "react";
import { getDay } from "../common/date";
import { UserContext } from "../App";
import toast, { Toaster } from "react-hot-toast";
import CommentField from "./CommentField";

const CommentCard = ({ index, leftVal, commentData }) => {
  let {
    commented_by: {
      personal_info: { profile_img, fullname, username },
    },
    commentedAt,
    comment,
    _id,
  } = commentData;

  let {
    userAuth: { accessToken },
  } = useContext(UserContext);

  const [isReplying, setIsReplying] = useState(false);

  const handleReply = () => {
    if (!accessToken) {
      return toast.error("login first for reply!");
    }

    setIsReplying((preVal) => !preVal);
  };

  return (
    <div className="w-full" style={{ paddingLeft: `${leftVal * 10}px` }}>
      <div className="my-5 p-6 rounded-md border border-grey">
        <div className="flex gap-3 items-center mb-8">
          <img
            src={profile_img}
            alt={username}
            className="w-6 h-6 rounded-full"
          />

          <p className="line-clamp-1">
            {fullname} @{username}
          </p>
          <p className="min-w-fit">{getDay(commentedAt)}</p>
        </div>

        <p className="font-gelasio text-xl ml-5">{comment}</p>

        <div className="flex gap-5 items-center mt-5">
          {
            //..................
            commentData.isReplyLoaded ? <button>Hide Reply</button> : ""
          }

          <button className="underline" onClick={handleReply}>
            Reply
          </button>
        </div>

        {isReplying ? (
          <div className="mt-8">
            <CommentField
              action="reply"
              index={index}
              replyingTo={_id}
              setIsReplying={setIsReplying}
            />
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default CommentCard;
