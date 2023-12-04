export interface Post {
  _id: string;
  imgUrl: string;
  caption: string;
  uploaderId: string;
  description: string;
  topic: string[];
  allowComment: boolean;
  comments: string[];
  reacts: [
    {
      reactorId: string;
      react: string;
      _id: string;
    }
  ];
  createdAt: string;
  updatedAt: string;
}
