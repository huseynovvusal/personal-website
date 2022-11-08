import mongoose from "mongoose";
import { Schema } from "mongoose";

const DescriptionSchema = new Schema({
  home_description: {
    type: String,
    required: true,
  },
  about_description: {
    type: String,
    required: true,
  },
});

const Description = mongoose.model("Description", DescriptionSchema);

export default Description;
