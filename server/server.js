import express, { json } from "express";
import mongoose from "mongoose";
import "dotenv/config";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { nanoid } from "nanoid";
import cors from "cors";
import multer from "multer";
import path, { resolve } from "path";
import admin from "firebase-admin";
import fileUpload from "express-fileupload";
// import serviceAccountKey from "./hkdev-ea2eb-firebase-adminsdk-kmzwr-f1baba000d.json" assert { type: "json" };

import { getAuth } from "firebase-admin/auth";
import cloudinary from "./utils/cloudinary.js";
//Schema's................
import User from "./Schema/User.js";
import Blog from "./Schema/Blog.js";

//
//
// 🖥️
const server = express();
let PORT = 3000;

//
//
//middle wares
server.use(cors());
server.use(express.json({ limit: "50mb" }));
server.use(express.urlencoded({ limit: "50mb", extended: true }));

//
//
//
//
//

//
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccountKey),
// });

// regex for email, password
let emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;

/* 
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/imgs");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});


const upload = multer({
  storage: storage,
});

 */

//
//
// connecting to database. 🖥️
mongoose.connect(process.env.DB_LOCATION, { autoIndex: true });

// Making API for listening roots/urls 🖥️

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token === null) {
    return res.status(401).json({ error: "No access token!" });
  }
  jwt.verify(token, process.env.SECRET_ACCESS_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Access token is invalid!" });
    }
    req.user = user.id;
    next();
  });
};

const generatedUsername = async (email) => {
  let username = email.split("@")[0];
  let isUsernameNotUnique = await User.exists({
    "personal_info.username": username,
  }).then((result) => result);

  if (isUsernameNotUnique) {
    username += nanoid().substring(0, 5);
  }
  return username;
};

const formatDataToSend = (user) => {
  const accessToken = jwt.sign({ id: user._id }, process.env.SECRET_ACCESS_KEY);

  return {
    accessToken,
    profile_img: user.personal_info.profile_img,
    username: user.personal_info.username,
    fullname: user.personal_info.fullname,
  };
};

//..................
// sign-up root 👇
//..................

server.post("/signup", (req, res) => {
  let { fullname, email, password } = req.body;

  // validating the data from client
  if (fullname.length < 3) {
    return res
      .status(403)
      .json({ error: "Fullname must be at least 3 letters long!" });
  }
  if (!email.length) {
    return res.status(403).json({ error: "Enter email!" });
  }
  if (!emailRegex.test(email)) {
    return res.status(403).json({ error: "Email is Invalid!" });
  }
  if (!passwordRegex.test(password)) {
    return res.status(403).json({
      error:
        "Password should be 6 to 20 characters long with a numeric, 1 lowercase and 1 uppercase letters!",
    });
  }
  bcrypt.hash(password, 10, async (err, hashed_password) => {
    let username = await generatedUsername(email);
    let user = new User({
      personal_info: {
        fullname,
        email,
        password: hashed_password,
        username,
      },
    });
    user
      .save()
      .then((u) => {
        return res.status(200).json(formatDataToSend(u));
      })
      .catch((err) => {
        if (err.code === 11000) {
          return res.status(500).json({ error: "Email already exist!" });
        }
        return res.status(500).json({ error: err.message });
      });
  });

  // return res.status(200).json({ status: "Okay" });
});

//..................
// sign-in route 👇
//..................

server.post("/signin", (req, res) => {
  let { email, password } = req.body;

  User.findOne({ "personal_info.email": email })
    .then((user) => {
      if (!user) {
        return res.status(403).json({ error: "Email not found!" });
      }

      bcrypt.compare(password, user.personal_info.password, (err, result) => {
        if (err) {
          return res.status(403).json({
            error: "😓Error occurred while login. Please try again! ",
          });
        }
        if (!result) {
          return res.status(403).json({ error: "Incorrect Password!" });
        } else {
          return res.status(200).json(formatDataToSend(user));
        }
      });

      // return res.json({ status: "🙂Got user document!" });
    })
    .catch((err) => {
      console.log(err.message);
      return res.status(500).json({ error: err.message });
    });
});

//............................
// sign-in with google-auth 👇
//............................

server.post("/google-auth", async (req, res) => {
  let { accessToken } = req.body;
  getAuth()
    .verifyIdToken(accessToken)
    .then(async (decodedUser) => {
      let { email, name, picture } = decodedUser;
      picture = picture.replace("s96-c", "s384-c");

      let user = await User.findOne({ "personal_info.email": email })
        .select(
          "personal_info.fullname personal_info.username personal_info.profile_img personal_info.google_auth"
        )
        .then((u) => {
          return u || null;
        })
        .catch((err) => res.status(500).json({ error: err.message }));

      if (user) {
        // login
        if (!user.google_auth) {
          return res.status(403).json({
            error:
              "This email was signed up without google. Please log-in with password to access the account!",
          });
        }
      } else {
        // sign-up
        let username = await generatedUsername(email);
        user = new User({
          personal_info: {
            fullname: name,
            email: email,
            profile_img: picture,
            username,
          },
          google_auth: true,
        });

        await user
          .save()
          .then((u) => {
            user = u;
          })
          .catch((err) => res.status(500).json({ error: err.message }));
      }

      return res.status(200).json(formatDataToSend(user));
    })
    .catch((err) =>
      res.status(500).json({
        error:
          "Failed to authenticate you with google. Try with some other google account.",
      })
    );
});

//..................
//  upload Banner image route 👇
//..................

server.post("/bannerUpload", (req, res) => {
  const fileStr = req.body.data;
  // console.log(fileStr);
  new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      fileStr,
      {
        upload_preset: "hk_dev",
      },
      (err, res) => {
        if (res && res.secure_url) {
          // console.log(res.secure_url);
          return resolve(res.secure_url);
        }
        console.log(err.message);
        return reject({ message: err.message });
      }
    );
  })
    .then((url) => res.send(url))
    .catch((err) => res.status(500).send(err));
});

//............................
// Publish Blog route 👇
//............................

server.post("/create-blog", verifyJWT, (req, res) => {
  let authorId = req.user;
  let { title, des, banner, tags, content, draft } = req.body;
  if (!title.length) {
    return res.status(403).json({
      error: "you must provide a title",
    });
  }

  if (!draft) {
    if (!des.length || des.length > 200) {
      return res.status(403).json({
        error: "you must provide blog description under 200 characters",
      });
    }

    if (!banner.length) {
      return res
        .status(403)
        .json({ error: "you must provide blog banner to publish it" });
    }

    if (!content.blocks.length) {
      return res
        .status(403)
        .json({ error: "There must be some blog content to publish it" });
    }

    if (!tags.length || tags.length > 10) {
      return res.status(403).json({
        error: "Provide tags in order to publish the blog, Maximum 10",
      });
    }
  }

  tags = tags.map((tag) => tag.toLowerCase());
  let blog_id =
    title
      .replace(/[^a-zA-Z0-9]/g, " ")
      .replace(/\s+/g, "-")
      .trim() + nanoid();
  let blog = new Blog({
    title,
    des,
    banner,
    content,
    tags,
    author: authorId,
    blog_id,
    draft: Boolean(draft),
  });

  blog
    .save()
    .then((blog) => {
      let incrementVal = draft ? 0 : 1;
      User.findOneAndUpdate(
        { _id: authorId },
        {
          $inc: { "account_info.total_posts": incrementVal },
          $push: { blogs: blog._id },
        }
      )
        .then((user) => {
          return res.status(200).json({ id: blog.blog_id });
        })
        .catch((err) => {
          return res
            .status(500)
            .json({ error: "Failed to update total posts number" });
        });
    })
    .catch((err) => {
      return res.status(500).json({ error: err.message });
    });
});

//............................
// Latest Blogs route 👇
//............................

server.post("/latest-blogs", (req, res) => {
  let { page } = req.body;

  let maxLimit = 5;

  Blog.find({ draft: false })
    .populate(
      "author",
      "personal_info.profile_img personal_info.username personal_info.fullname -_id"
    )
    .sort({ publishedAt: -1 })
    .select("blog_id title des banner activity tags publishedAt -_id")
    .skip((page - 1) * maxLimit)
    .limit(maxLimit)
    .then((blogs) => {
      return res.status(200).json({ blogs });
    })
    .catch((err) => {
      return res.status(500).json({ error: err.message });
    });
});

//............................
// all-latest-blogs-count 👇
//............................

server.post("/all-latest-blogs-count", (req, res) => {
  Blog.countDocuments({ draft: false })
    .then((count) => {
      return res.status(200).json({ totalDocs: count });
    })
    .catch((err) => {
      console.log(err.message);
      return res.status(500).json({ error: err.message });
    });
});

//............................
// trending Blogs route 👇
//............................

server.get("/trending-blogs", (req, res) => {
  Blog.find({ draft: false })
    .populate(
      "author",
      "personal_info.profile_img personal_info.username personal_info.fullname -_id"
    )
    .sort({
      "activity.total_read": -1,
      "activity.total_likes": -1,
      publishedAt: -1,
    })
    .select("blog_id title publishedAt -_id")
    .limit(5)
    .then((blogs) => {
      return res.status(200).json({ blogs });
    })
    .catch((err) => {
      return res.status(500).json({ error: err.message });
    });
});

//............................
// search Blogs route 👇
//............................

server.post("/search-blogs", (req, res) => {
  let { tag, page } = req.body;
  let findQuery = { tags: tag, draft: false };
  let maxLimit = 5;
  Blog.find(findQuery)
    .populate(
      "author",
      "personal_info.profile_img personal_info.username personal_info.fullname -_id"
    )
    .sort({ publishedAt: -1 })
    .select("blog_id title des banner activity tags publishedAt -_id")
    .skip((page - 1) * maxLimit)
    .limit(maxLimit)
    .then((blogs) => {
      return res.status(200).json({ blogs });
    })
    .catch((err) => {
      return res.status(500).json({ error: err.message });
    });
});

//............................
// search Blogs count route 👇
//............................

server.post("/search-blogs-count", (req, res) => {
  let { tag } = req.body;
  let findQuery = { tags: tag, draft: false };
  Blog.countDocuments(findQuery)
    .then((count) => {
      return res.status(200).json({ totalDocs: count });
    })
    .catch((err) => {
      console.log(err.message);
      return res.status(500).json({ error: err.message });
    });
});

//
//....................................
//  🖥️🖥️🖥️ listening on the port 👇
//....................................
//
//

server.listen(PORT, () => {
  console.log(`Listening on the port-> ${PORT}`);
});
