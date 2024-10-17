import { Injectable } from '@nestjs/common';
import User from './User';
import { MongoClient, ObjectId } from 'mongodb';
import * as dotenv from 'dotenv';

@Injectable()
export class UsersService {
  constructor() {
    dotenv.config();
  }

  async findOneByName(username: string): Promise<User | undefined> {
    const client = new MongoClient(process.env.MONGODB_URI);
    try {
      await client.connect();
      const db = client.db(process.env.MONGO_DB);
      const collection = db.collection(process.env.MONGO_USERS_COLLECTION);
      const data = await collection.findOne({ username: username });
      await client.close();
      return data as User;
    } catch (e) {
      console.log(e);
      console.log('No se ha conectado a la BD');
    }
  }

  async findOne(id: ObjectId): Promise<User | undefined> {
    const client = new MongoClient(process.env.MONGODB_URI);
    try {
      await client.connect();
      const db = client.db(process.env.MONGO_DB);
      const collection = db.collection(process.env.MONGO_USERS_COLLECTION);
      const data = await collection.findOne({ _id: id });
      await client.close();
      return data as User;
    } catch (e) {
      console.log(e);
      console.log('No se ha conectado a la BD');
    }
  }

  async createUser(user: User): Promise<boolean> {
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    const db = client.db(process.env.MONGO_DB);
    const collection = db.collection(process.env.MONGO_USERS_COLLECTION);
    const userExists = await collection.findOne({
      username: user.username,
    });
    if (!userExists) {
      await collection.insertOne(user);
      return true;
    }
    await client.close();
    return false;
  }

  async updatePassword(user: User, hashPass: string): Promise<boolean> {
    try {
      const client = new MongoClient(process.env.MONGODB_URI);
      await client.connect();
      const db = client.db(process.env.MONGO_DB);
      const collection = db.collection(process.env.MONGO_USERS_COLLECTION);
      user.updatePassword = false;
      user.password = hashPass;
      await collection.replaceOne({ _id: user._id }, user);
      await client.close();
      return true;
    } catch {
      return false;
    }
  }
}
