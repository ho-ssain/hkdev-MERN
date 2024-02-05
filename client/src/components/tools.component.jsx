/* eslint-disable no-unused-vars */
import Embed from "@editorjs/embed";
import List from "@editorjs/list";
import Image from "@editorjs/image";
import Header from "@editorjs/header";
import Quote from "@editorjs/quote";
import Marker from "@editorjs/marker";
import InlineCode from "@editorjs/inline-code";
import axios from "axios";

async function uploadImageByUrl(e) {
  let link = new Promise((resolve, reject) => {
    try {
      resolve(e);
    } catch (err) {
      reject(err);
    }
  });

  const url = await link;
  return {
    success: 1,
    file: { url },
  };
}

function uploadImageByFile(e) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(e);
    reader.onloadend = async () => {
      try {
        const response = await axios.post(
          import.meta.env.VITE_SERVER_DOMAIN + "/bannerUpload",
          {
            data: reader.result,
          }
        );
        const imageUrl = response.data;
        if (imageUrl) {
          resolve({
            success: 1,
            file: { url: imageUrl }, // Use 'url' property instead of 'imageUrl'
          });
        } else {
          reject(new Error("Image upload failed."));
        }
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = (error) => {
      reject(error);
    };
  });
}

export const Tools = {
  embed: Embed,
  list: {
    class: List,
    inlineToolbar: true,
  },
  image: {
    class: Image,
    config: {
      uploader: {
        uploadByUrl: uploadImageByUrl,
        uploadByFile: uploadImageByFile,
      },
    },
  },
  header: {
    class: Header,
    config: {
      placeholder: "Type Heading....",
      levels: [2, 3],
      defaultLevel: 2,
    },
  },
  quote: {
    class: Quote,
    inlineToolbar: true,
  },
  marker: Marker,
  inlineCode: InlineCode,
};
