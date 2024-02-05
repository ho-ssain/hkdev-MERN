/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { Link, useNavigate, useParams } from "react-router-dom";
import logo from "../assets/logo.png";
import AnimationWrapper from "../common/page-animation";
import defaultBanner from "../assets/blog banner.png";
import loader from "../assets/loading.gif";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";

import EditorJS from "@editorjs/editorjs";

import { UserContext } from "../App";
import { EditorContext } from "../pages/editor.pages";
import { Tools } from "./tools.component";

const BlogEditor = () => {
  let navigate = useNavigate();
  // const [file, setFile] = useState("");
  const [loading, setLoading] = useState(false);

  let {
    blog,
    blog: { title, banner, content, tags, des } = {},
    setBlog,
    textEditor,
    setTextEditor,
    setEditorState,
  } = useContext(EditorContext);

  let { userAuth: { accessToken } = {} } = useContext(UserContext);

  let { blog_id } = useParams();

  // useEffect

  useEffect(() => {
    if (!textEditor.isReady) {
      setTextEditor(
        new EditorJS({
          holder: "textEditor",
          data: Array.isArray(content) ? content[0] : content,
          tools: Tools,
          placeholder: "Write here...",
        })
      );
    }
  }, []);

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

  const handlePublishEvent = (e) => {
    if (!banner.length) {
      return toast.error("Upload a blog banner to publish it.");
    }
    if (!title.length) {
      return toast.error("Write blog title to publish it.");
    }
    if (textEditor.isReady) {
      textEditor
        .save()
        .then((data) => {
          if (data.blocks.length) {
            setBlog({ ...blog, content: data });
            setEditorState("publish");
          } else {
            return toast.error("Write something in your blog to publish it.");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleSaveDraft = (e) => {
    if (e.target.classList.contains("disable")) {
      return;
    }

    if (!title.length) {
      return toast.error("Write blog title before saving it as a draft");
    }

    let loadingToast = toast.loading("Saving draft.......");
    e.target.classList.add("disable");

    if (textEditor.isReady) {
      textEditor.save().then((content) => {
        let blogObj = {
          title,
          banner,
          des,
          content,
          tags,
          draft: true,
        };

        axios
          .post(
            import.meta.env.VITE_SERVER_DOMAIN + "/create-blog",
            { ...blogObj, id: blog_id },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          )
          .then(() => {
            e.target.classList.remove("disable");
            toast.dismiss(loadingToast);
            toast.success("Saved 👍");
            setTimeout(() => {
              navigate("/");
            }, 500);
          })
          .catch(({ response }) => {
            e.target.classList.remove("disable");
            toast.dismiss(loadingToast);

            return toast.error(response.data.error);
          });
      });
    }
  };

  return (
    <>
      <nav className="navbar">
        {/* logo  */}
        <Link to="/" className="flex-none w-32">
          <img src={logo} alt="hkDev" />
        </Link>

        {/* A paragraph which shows the title of the blog  */}
        <p className="max-md:hidden text-black line-clamp-1 w-full">
          {title.length ? title : "New Blog"}
        </p>

        <div className="flex gap-4 ml-auto">
          <button className="btn-dark py-1" onClick={handlePublishEvent}>
            Publish
          </button>
          <button className="btn-light py-1" onClick={handleSaveDraft}>
            Save Draft
          </button>
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
              defaultValue={title}
              placeholder="blog title"
              className="text-3xl font-medium w-full h-20 outline-none resize-none mt-10 loading-tight placeholder:opacity-40"
              onKeyDown={handleTitleKeyDown}
              onChange={handleTitleChange}
            ></textarea>
            <hr className="w-full opacity-10 my-5" />
            {/*------- Editor -------------*/}
            <div id="textEditor" className="font-gelasio"></div>
          </div>
        </section>
      </AnimationWrapper>
    </>
  );
};

export default BlogEditor;
