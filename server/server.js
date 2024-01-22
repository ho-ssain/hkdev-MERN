import express from "express";
import mongoose from "mongoose";
import "dotenv/config";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cors from "cors";
import { nanoid } from "nanoid";

// Schema
import User from "./schemas/User.js";

// set up the server
const server = express();

// middle wares
server.use(express.json);

// set up the database
mongoose.connect(process.env.DB_LOCATION, {
  autoIndex: true,
});

// >--- API Routes S--->

// >---- User Auth Routes Starts---->
// regex for email, password
let emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;

const generatedUsername = async (email) => {
  let username = email.split("@")[0];
  let isUsernameExist = await User.exists({
    "personal_info.username": username,
  }).then((result) => result);

  if (isUsernameExist) {
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

  // hashing the password
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
});

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
    })
    .catch((err) => {
      console.log(err.message);
      return res.status(500).json({ error: err.message });
    });
});
// <---- User Auth Routes Ends----<

// <--- API Routes E---<

// listening to the port
let PORT = 3000;
server.listen(PORT, () => {
  console.log(`Listening to port -> ${PORT}`);
});
