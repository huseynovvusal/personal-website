import mongoose from "mongoose";
import { Schema } from "mongoose";

const LinkSchema = new Schema({
  link_image: {
    type: String,
    required: true,
  },
  link_name: {
    type: String,
    required: true,
  },
  link_username: {
    type: String,
    required: true,
  },
  link_description: {
    type: String,
    required: true,
  },
  link_url: {
    type: String,
    required: true,
  },
});

const Link = mongoose.model("Link", LinkSchema);

export default Link;
