import express, { json } from "express";
import mongoose from "mongoose";
import "dotenv/config";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { nanoid } from "nanoid";
import cors from "cors";
import admin from "firebase-admin";
import serviceAccountKey from "./hkdev-ea2eb-firebase-adminsdk-kmzwr-f1baba000d.json" assert { type: "json" };

import { getAuth } from "firebase-admin/auth";

//Schema's................
import User from "./Schema/User.js";

//
//
//
const server = express();
let PORT = 3000;

//
admin.initializeApp({
  credential: admin.credential.cert(serviceAccountKey),
});

// regex for email, password
let emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;

//
//
//middle wares
server.use(express.json());
server.use(cors());
//
//
// connecting to database.
mongoose.connect(process.env.DB_LOCATION, { autoIndex: true });

// Making API for listening roots/urls
//
// sign-up root.........

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

//
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

// sign-in root.........
//
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

// sign-in with google-auth
//
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

//
//
//
//
//
//.................
//.................
//
//

// listening on the port.
server.listen(PORT, () => {
  console.log(`Listening on the port-> ${PORT}`);
});
