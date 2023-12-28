export interface Message {
  _id: string;
  sender: string;
  message: string;
  sendAt: Date;
}
export interface ChatBox {
  _id: string;
  user1: string;
  user2: string;
  message: Message;
  createdAt: Date;
}
