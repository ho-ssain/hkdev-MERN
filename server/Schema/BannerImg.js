import { Schema, model } from "mongoose";

const BannerSchema = new Schema({
  image: {
    type: String,
  },
});

const BannerModel = model("banner", BannerSchema);

export default BannerModel;
