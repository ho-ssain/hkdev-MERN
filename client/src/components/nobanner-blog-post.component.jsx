/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import { Link } from "react-router-dom";
import { getDay } from "../common/date";

const MinimalBlogPost = ({ blog, index }) => {
  let { title, blog_id: id, author, publishedAt } = blog;

  const fullname = author?.personal_info?.fullname || "Unknown";
  const profile_img = author?.personal_info?.profile_img || ""; // Provide a default value for profile_img
  const username = author?.personal_info?.username || ""; // Provide a default value for username

  return (
    <Link to={`/blog/${id}`} className="flex gap-5 mb-8">
      <h1 className="blog-index">{index < 10 ? "0" + (index + 1) : index}</h1>

      <div>
        <div className="flex gap-2 items-center mb-7">
          <img src={profile_img} className="w-6 h-6 rounded-full" />
          <p className="line-clamp-1">
            {" "}
            {fullname} @{username}
          </p>
          <p className="min-w-fit"> {getDay(publishedAt)} </p>
        </div>

        <h1 className="blog-title">{title}</h1>
      </div>
    </Link>
  );
};

export default MinimalBlogPost;
