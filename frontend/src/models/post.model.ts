export interface Reply {
  _id: string;
  reply: string;
  replierId: string;
  replyAt: string;
  likes: string[];
}

export interface Comment {
  _id: string;
  likes: string[];
  commenterId?: string;
  comment?: string;
  createdAt?: string;
  replies: Reply[];
}

export interface Reaction {
  _id: string;
  reactorId: string;
  react: string;
}

export interface Post {
  _id: string;
  imgUrl: string;
  caption: string;
  uploaderId: string;
  description: string;
  topic: string[];
  allowComment: boolean;
  comments?: Comment[];
  reacts?: Reaction[];
  createdAt: string;
  updatedAt: string;
}
