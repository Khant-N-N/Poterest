import { InferSchemaType, Schema, model } from "mongoose";

const chatSchema = new Schema(
  {
    user1: { type: String, required: true },
    user2: { type: String, required: true },
    messages: {
      type: [
        {
          sender: { type: String },
          message: { type: String },
          sendAt: { type: Date },
        },
      ],
    },
  },
  { timestamps: true }
);

type chat = InferSchemaType<typeof chatSchema>;
export default model<chat>("chat", chatSchema);
