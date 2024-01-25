/* eslint-disable no-unused-vars */
import { Link } from "react-router-dom";
import logo from "../assets/logo-2.png";
import AnimationWrapper from "../common/page-animation";
import defaultBanner from "../assets/blog banner.png";
import loader from "../assets/loading.gif";
import { useRef, useState } from "react";
import axios from "axios";

const BlogEditor = () => {
  const [file, setFile] = useState("");
  const [loading, setLoading] = useState(false);

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
    await axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + "/bannerUpload", {
        data: base64EncodedImage,
      })
      .then((res) => {
        setFile(res.data);
        console.log("👉 " + res.data);
      })
      .then(() => setLoading(false))
      .catch((err) => console.error(err));
  }

  return (
    <>
      <nav className="navbar">
        {/* logo  */}
        <Link to="/" className="flex-none w-10">
          <img src={logo} alt="hkDev" />
        </Link>

        {/* A paragraph which shows the title of the blog  */}
        <p className="max-md:hidden text-black line-clamp-1 w-full">New Blog</p>

        <div className="flex gap-4 ml-auto">
          <button className="btn-dark py-2">Publish</button>
          <button className="btn-light py-2">Save Draft</button>
        </div>
      </nav>

      <AnimationWrapper>
        <section>
          <div className="mx-auto max-w-[900px] w-full">
            <div className="relative aspect-video hover:opacity-80 bg-white border-4 border-grey">
              <label htmlFor="uploadBanner">
                {loading ? (
                  <img src={loader} alt="loader" />
                ) : (
                  <img
                    src={file || defaultBanner}
                    alt="banner"
                    className="z-20"
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
          </div>
        </section>
      </AnimationWrapper>
    </>
  );
};

export default BlogEditor;
