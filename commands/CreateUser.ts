import User from 'src/users/User';
import { ObjectId } from 'mongodb';
import * as dotenv from 'dotenv';
import CommandInterface from './AbstractCommand';
import { UsersService } from '../src/users/users.service';
import { AuthService } from '../src/auth/auth.service';

export default class CreateUser extends CommandInterface {
  declare params: {
    username: string;
  };
  constructor() {
    super();
    this.params = {
      username: null,
    };
    dotenv.config();
  }
  async run(args: string[]): Promise<void> {
    const password = process.env.CREATE_USER_PASS;
    if (args.length === 2 && password) {
      try {
        dotenv.config();
        const hash = await AuthService.prototype.generatePasswordHash(password);
        this.params = {
          username: args[1],
        };
        await this.addUserToDatabase({
          _id: new ObjectId(),
          username: this.params.username,
          password: hash,
          updatePassword: true,
        } as User);
      } catch (error) {
        console.error(error);
      }
    } else {
      console.log(`Usage: ${this.useMessage()}`);
    }
  }

  async addUserToDatabase(user: User) {
    try {
      if (await UsersService.prototype.createUser(user)) {
        console.log('User created succesfully');
      } else {
        console.log('User already exists or cannot be created');
      }
    } catch (e) {
      console.log('Cannot connect to database', e);
    }
  }
}
