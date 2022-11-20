import mongoose from "mongoose";
import { Schema } from "mongoose";

const CourseSchema = new Schema({
  course_image: {
    type: String,
    required: true,
  },
  course_name: {
    type: String,
    required: true,
  },
  course_details: {
    type: String,
    required: true,
  },
});

const Course = mongoose.model("Course", CourseSchema);

export default Course;
