import { InferSchemaType, Schema, model } from "mongoose";

const postSchema = new Schema(
  {
    imgUrl: { type: String, required: true },
    caption: { type: String, default: "" },
    uploaderId: { type: String, required: true },
    description: { type: String, default: "" },
    topic: [String],
    allowComment: { type: Boolean, default: true },
    comments: [Object],
    reacts: [
      {
        reactorId: { type: String },
        react: {
          type: String,
          enum: ["good idea", "love", "thanks", "wow", "haha"],
        },
      },
    ],
  },
  { timestamps: true }
);

type Post = InferSchemaType<typeof postSchema>;
export default model<Post>("Post", postSchema);
