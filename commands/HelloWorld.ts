import CommandInterface from './AbstractCommand';

export default class HelloWorld extends CommandInterface {
  declare params: {
    name: string;
  };

  constructor() {
    super();
    this.params = {
      name: 'world',
    };
  }

  run(args: string[]): void {
    if (args.length === 2) {
      this.params = {
        name: args[1],
      };
    }
    console.log(`Hello ${this.params.name}!`);
  }
}
