import { InferSchemaType, Schema, model } from "mongoose";

const postSchema = new Schema(
  {
    imgUrl: { type: String, required: true },
    caption: { type: String, default: "" },
    uploaderId: { type: String, required: true },
    comments: [String],
    reacts: [String],
  },
  { timestamps: true }
);

type Post = InferSchemaType<typeof postSchema>;
export default model<Post>("Post", postSchema);
