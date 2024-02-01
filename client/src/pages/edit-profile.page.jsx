import { useContext } from "react";
import { UserContext } from "../App";

const EditProfile = () => {
  let { userAuth } = useContext(UserContext);

  // Check if userAuth is defined and has the accessToken property
  let accessToken = userAuth?.accessToken;

  return <div>EditProfile</div>;
};

export default EditProfile;
