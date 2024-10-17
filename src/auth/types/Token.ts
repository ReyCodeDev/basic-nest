import { ObjectId } from 'mongodb';

export default interface Token {
  _id: ObjectId | string;
  username: string;
  type?: string;
}
