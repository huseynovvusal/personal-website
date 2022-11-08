import mongoose from "mongoose";
import { Schema } from "mongoose";

const BlogSchema = new Schema({
    blog_image: {
        type: String,
        required: true,
      },
    blog_name: {
        type: String,
        required: true,
    },
    blog_description: {
        type: String,
        required: true,
    },
});

const Blog = mongoose.model("Blog", BlogSchema);

export default Blog;
