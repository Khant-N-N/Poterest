export interface Post {
  _id: string;
  imgUrl: string;
  caption: string;
  uploaderId: string;
  description: string;
  topic: string[];
  allowComment: boolean;
  comments: [
    {
      _id: string;
      commenterId: string;
      comment: string;
      createdAt: string;
      likes: string[];
      replies: [
        {
          _id: string;
          reply: string;
          replierId: string;
          replyAt: string;
          likes: string[];
        }
      ];
    }
  ];
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
