/* eslint-disable no-unused-vars */
import { Link } from "react-router-dom";
import logo from "../assets/logo-2.png";
import AnimationWrapper from "../common/page-animation";
import defaultBanner from "../assets/blog banner.png";
import loader from "../assets/loading.gif";
import { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";
import { EditorContext } from "../pages/editor.page";

const BlogEditor = () => {
  // const [file, setFile] = useState("");
  const [loading, setLoading] = useState(false);

  let {
    blog,
    blog: { title, banner, concent, tags, des },
    setBlog,
  } = useContext(EditorContext);

  // console.log(blog);

  // useEffect to retrieve the image URL from the local storage on component mount

  function handleBannerUpload(e) {
    e.preventDefault();
    const bannerFile = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(bannerFile);
    reader.onloadend = () => {
      uploadImage(reader.result);
    };
  }

  async function uploadImage(base64EncodedImage) {
    // console.log(base64EncodedImage);
    setLoading(true);
    try {
      const response = await axios.post(
        import.meta.env.VITE_SERVER_DOMAIN + "/bannerUpload",
        {
          data: base64EncodedImage,
        }
      );
      const imageUrl = response.data;

      // Save the image URL to local storage.
      // localStorage.setItem("blogEditorFile", imageUrl);
      // setFile(imageUrl);
      setBlog({ ...blog, banner: imageUrl });
      // console.log("👉 " + imageUrl);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      toast.success("Uploaded👍");
    }
  }

  const handleTitleKeyDown = (e) => {
    if (e.keyCode == 13) {
      // enter key
      e.preventDefault();
    }
  };

  const handleTitleChange = (e) => {
    let input = e.target;
    input.style.height = "auto";
    input.style.height = input.scrollHeight + "px";

    setBlog({ ...blog, title: input.value });
  };

  const handleBannerError = (e) => {
    let img = e.target;
    img.src = defaultBanner;
  };

  return (
    <>
      <nav className="navbar">
        {/* logo  */}
        <Link to="/" className="flex-none w-10">
          <img src={logo} alt="hkDev" />
        </Link>

        {/* A paragraph which shows the title of the blog  */}
        <p className="max-md:hidden text-black line-clamp-1 w-full">
          {title.length ? title : "New Blog"}
        </p>

        <div className="flex gap-4 ml-auto">
          <button className="btn-dark py-2">Publish</button>
          <button className="btn-light py-2">Save Draft</button>
        </div>
      </nav>

      <Toaster />
      <AnimationWrapper>
        <section>
          <div className="mx-auto max-w-[900px] w-full">
            {/*------- banner div ----------- */}
            <div className="relative aspect-video hover:opacity-80 bg-white border-4 border-grey">
              <label htmlFor="uploadBanner">
                {loading ? (
                  <img src={loader} alt="loader" />
                ) : (
                  <img
                    src={banner}
                    alt="banner"
                    className="z-20"
                    onError={handleBannerError}
                  />
                )}

                <input
                  id="uploadBanner"
                  type="file"
                  accept=".png, .jpg, .jpeg"
                  hidden
                  onChange={handleBannerUpload}
                />
              </label>
            </div>
            {/*------- blog title texture ----------- */}
            <textarea
              placeholder="blog title"
              className="text-3xl font-medium w-full h-20 outline-none resize-none mt-10 loading-tight placeholder:opacity-40"
              onKeyDown={handleTitleKeyDown}
              onChange={handleTitleChange}
            ></textarea>
            {/*------- Editor -------------*/}
            <hr className="w-full opacity-10 my-5" />
          </div>
        </section>
      </AnimationWrapper>
    </>
  );
};

export default BlogEditor;
