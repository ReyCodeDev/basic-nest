import path from 'path';
import fs from 'fs';
import { exit } from 'process';

const args = process.argv.slice(2);
const commandsDir = path.join(__dirname, 'commands');

run();

function verifyFile(commandsDir: string, file: string) {
  const fileData = path.parse(file);
  if (fileData.name !== 'AbstractCommand') {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const funct = require(`${commandsDir}/${fileData.name}`).default;

    console.log(` - ${new funct().useMessage()}`);
  }
}

async function run() {
  if (args.length === 0) console.log('Usage:\n - bun command <comando>');
  const commandName = args[0];
  if (commandName) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const funct = require(`${commandsDir}/${commandName}`).default;
      await new funct().run(args);
      exit(0);
    } catch (e) {
      console.log(`Command ${commandName} not found Reason: ${e.message}`);
    }
  }
  fs.readdir(commandsDir, (err, files) => {
    if (err) {
      return console.log(`Unable to scan directory: ${err.message}`);
    }
    console.log('Available Commands:');
    for (const file of files) verifyFile(commandsDir, file);
  });
}
