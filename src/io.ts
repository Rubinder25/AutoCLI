import readline from 'readline';
import {FlagConfigType} from './types';

// TODO extend interface
function getQuery(
  query: string,
  showAstrisk: boolean | undefined,
): Promise<string> {
  return new Promise((resolve) => {
    let rl: any = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: true,
    });

    rl.question(`${query}: `, (userInput: string) => {
      resolve(userInput);
      rl.close();
    });

    rl._writeToOutput = (userInput: string): void => {
      showAstrisk ? rl.output.write('*') : rl.output.write(userInput);
    };
  });
}

export async function getSingleFlagInput(
  key: string,
  flagConfig: FlagConfigType,
): Promise<string | undefined> {
  let res = undefined;
  res = await getQuery(key, flagConfig.showAstrisk);
  return res;
}
