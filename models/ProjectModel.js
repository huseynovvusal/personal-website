import mongoose from "mongoose";
import { Schema } from "mongoose";

const ProjectSchema = new Schema({
  project_image: {
    type: String,
    required: true,
  },
  project_name: {
    type: String,
    required: true,
  },
  project_description: {
    type: String,
    required: true,
  },
  project_url: {
    type: String,
    required: true,
  },
});

const Project = mongoose.model("Project", ProjectSchema);

export default Project;
