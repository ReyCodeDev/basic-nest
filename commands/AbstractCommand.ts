export default abstract class AbstractCommand {
  params: object;
  abstract run(args: []): void;
  useMessage(): string {
    let keys: string;
    if (this.params) {
      keys = `<${Object.keys(this.params).join('> <')}>`;
    } else {
      keys = '';
    }
    return `${this.constructor.name} ${keys}`;
  }
}
