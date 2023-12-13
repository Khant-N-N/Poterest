import { InferSchemaType, Schema, model } from "mongoose";

const postSchema = new Schema(
  {
    imgUrl: { type: String, required: true },
    caption: { type: String, default: "" },
    uploaderId: { type: String, required: true },
    description: { type: String, default: "" },
    topic: [String],
    allowComment: { type: Boolean, default: true },
    comments: [
      {
        commenterId: { type: String },
        comment: { type: String },
        createdAt: { type: Date },
      },
    ],
    reacts: [
      {
        reactorId: { type: String },
        react: {
          type: String,
          enum: ["good_idea", "love", "thanks", "wow", "haha"],
        },
      },
    ],
  },
  { timestamps: true }
);

type Post = InferSchemaType<typeof postSchema>;
export default model<Post>("Post", postSchema);
