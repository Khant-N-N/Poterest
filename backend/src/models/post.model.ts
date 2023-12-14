import { InferSchemaType, Schema, model } from "mongoose";

const postSchema = new Schema(
  {
    imgUrl: { type: String, required: true },
    caption: { type: String, default: "" },
    uploaderId: { type: String, required: true },
    description: { type: String, default: "" },
    topic: { type: [String] },
    allowComment: { type: Boolean, default: true },
    comments: {
      type: [
        {
          commenterId: { type: String },
          comment: { type: String },
          createdAt: { type: Date },
          likes: [String],
          replies: [
            {
              reply: { type: String },
              replierId: { type: String },
              replyAt: { type: Date },
              likes: [String],
            },
          ],
        },
      ],
      select: false,
    },
    reacts: {
      type: [
        {
          reactorId: { type: String },
          react: {
            type: String,
            enum: ["good_idea", "love", "thanks", "wow", "haha"],
          },
        },
      ],
      select: false,
    },
  },
  { timestamps: true }
);

type Post = InferSchemaType<typeof postSchema>;
export default model<Post>("Post", postSchema);
