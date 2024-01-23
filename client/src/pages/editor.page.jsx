/* eslint-disable no-unused-vars */
import { useContext, useState } from "react";
import { UserContext } from "../App";
import { Navigate } from "react-router-dom";
import BlogEditor from "../components/BlogEditor";
import PublishForm from "../components/PublishForm";

const Editor = () => {
  const [editorState, setEditorState] = useState("editor");

  let { userAuth: { accessToken } = { accessToken: null } } =
    useContext(UserContext);

  return accessToken === "null" ? (
    <Navigate to="/signin" />
  ) : editorState === "editor" ? (
    <BlogEditor />
  ) : (
    <PublishForm />
  );
};

export default Editor;
