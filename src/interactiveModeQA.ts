import readline from 'readline';
import stream from 'stream';
import {FlagConfigType} from './types';
// TODO extend interface
function getQuery(query: string, showAstrisk: boolean): Promise<string> {
  return new Promise((resolve) => {
    let Writable = stream.Writable;

    let muteOutput = false;

    let outputStream = new Writable({
      write(chunk) {
        chunk = chunk.toString('utf8');

        if (!muteOutput) {
          process.stdout.write(chunk);
        } else {
          process.stdout.write('*');
        }
      },
    });

    let rl = readline.createInterface({
      input: process.stdin,
      output: outputStream,
    });

    rl.question(`${query} `, function(userInput: string) {
      resolve(userInput);
      rl.close();
    });

    muteOutput = showAstrisk;
  });
}

export async function getSingleFlagInput(
  key: string,
  flagConfig: FlagConfigType,
): Promise<string | undefined> {
  let res = undefined;
  const defaultValue = (flagConfig as any).hasOwnProperty('default')
    ? flagConfig.default
    : undefined;
  const defaultValueString =
    defaultValue !== undefined ? `(${defaultValue})` : '';

  const queryString = `${key}: ${defaultValueString}`;
  res = await getQuery(queryString, flagConfig.showAstrisk !== true);

  if (res === '' && defaultValue) {
    res = defaultValue;
  }

  return res;
}
