/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

import { Link } from "react-router-dom";
import { getDay } from "../common/date";
import { useContext, useState } from "react";
import NotificationCommentField from "./notification-comment-field.component";
import { UserContext } from "../App";
import axios from "axios";

const NotificationCard = ({ data, index, notificationsState }) => {
  let [isReplying, setReplying] = useState(false);

  let {
    userAuth: {
      username: author_username,
      profile_img: author_profile_img,
      accessToken,
    } = {},
  } = useContext(UserContext);

  let {
    seen,
    type,
    reply,
    comment,
    replied_on_comment,
    createdAt,
    user,
    user: {
      personal_info: { fullname, username, profile_img },
    },
    blog: { _id, blog_id, title },
    _id: notification_id,
  } = data;

  console.log(data.seen);

  let {
    notifications,
    notifications: { results, totalDocs } = {},
    setNotifications,
  } = notificationsState;

  const handleReply = () => {
    setReplying((preVal) => !preVal);
  };

  const handleDelete = (comment_id, type, target) => {
    target.setAttribute("disabled", true);

    axios
      .post(
        import.meta.env.VITE_SERVER_DOMAIN + "/delete-comment",
        { _id: comment_id },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      )
      .then(() => {
        if (type === "comment") {
          results.splice(index, 1);
        } else {
          delete results[index].reply;
        }

        target.removeAttribute("disabled");
        setNotifications({
          ...notifications,
          results,
          totalDocs: totalDocs - 1,
          deleteDocCount: notifications.deleteDocCount + 1,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div
      className={
        "p-6 border-b border-grey border-l-black " + (!seen ? "border-l-2" : "")
      }
    >
      <div className="flex gap-5 mb-3">
        <img
          src={profile_img}
          alt="profile"
          className="w-14 h-14 flex-none rounded-full"
        />
        <div className="w-full">
          <h1 className="font-medium text-xl text-dark-grey">
            <span className="lg:inline-block hidden capitalize">
              {fullname}
            </span>
            <Link
              to={`/user/${username}`}
              className="mx-1 text-black underline"
            >
              @{username}
            </Link>
            <span className="font-normal">
              {
                //...............
                type === "like"
                  ? "liked your blog"
                  : type === "comment"
                  ? "commented on"
                  : "replied on"
              }
            </span>
          </h1>

          {type === "reply" ? (
            <div className="p-2 mt-3 rounded-md bg-grey">
              <p>{replied_on_comment.comment}</p>
            </div>
          ) : (
            <Link
              to={`/blog/${blog_id}`}
              className="font-medium text-dark-grey hover:underline hover:text-purple line-clamp-1"
            >
              {`"${title}`}{" "}
            </Link>
          )}
        </div>
      </div>

      {
        //------------------------
        type !== "like" ? (
          <p className="ml-14 pl-5 font-gelasio my-5 text-xl">
            {comment.comment}
          </p>
        ) : (
          ""
        )
      }

      <div className="ml-14 pl-5 mt-3 text-dark-grey flex gap-8">
        <p>{getDay(createdAt)}</p>

        {
          //...................
          type !== "like" ? (
            <>
              {
                //------------------------
                !reply ? (
                  <button
                    className="underline hover:text-black"
                    onClick={handleReply}
                  >
                    Reply
                  </button>
                ) : (
                  ""
                )
              }
              <button
                className="underline hover:text-red"
                onClick={(e) => handleDelete(comment._id, "comment", e.target)}
              >
                Delete
              </button>
            </>
          ) : (
            ""
          )
        }
      </div>

      {
        //--------------------
        isReplying ? (
          <div>
            <NotificationCommentField
              _id={_id}
              blog_author={user}
              index={index}
              replyingTo={comment._id}
              setReplying={setReplying}
              notification_id={notification_id}
              notificationData={notificationsState}
            />
          </div>
        ) : (
          ""
        )
      }

      {
        //----------------
        reply ? (
          <div className="ml-20 p-5 bg-grey mt-5 rounded-md">
            <div className="flex gap-3 mb-3">
              <img
                src={author_profile_img}
                alt={author_username}
                className="w-8 h-8 rounded-full"
              />
              <div>
                <h1 className="font-medium text-xl text-dark-grey">
                  <Link
                    to={`/user/${author_username}`}
                    className="mx-1 text-black underline"
                  >
                    {author_username}
                  </Link>
                  <span className="font-normal">replied to</span>
                  <Link
                    to={`/user/${username}`}
                    className="mx-1 text-black underline"
                  >
                    {username}
                  </Link>
                </h1>
              </div>
            </div>

            <p className="ml-14 font-gelasio text-xl my-2">{reply.comment}</p>

            <button
              className="underline hover:text-red ml-14 mt-2"
              onClick={(e) => handleDelete(comment._id, "reply", e.target)}
            >
              Delete
            </button>
          </div>
        ) : (
          ""
        )
      }
    </div>
  );
};

export default NotificationCard;
