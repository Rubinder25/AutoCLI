import readline from 'readline';
import stream, {Readable} from 'stream';
import {FlagConfigType} from './types';
// TODO extend interface
function getQuery(query: string, showAstrisk: boolean): Promise<string> {
  return new Promise((resolve) => {
    let Writable = stream.Writable;

    let mutedOutput = false;

    let outputStream = new Writable({
      write(chunk, _enc, cb) {
        chunk = chunk.toString('utf8');
        if (mutedOutput) {
          process.stdout.write('*');
        } else {
          process.stdout.write(chunk);
        }
        cb();
      },
      final(cb) {
        if (mutedOutput) {
          cb();
        }
      },
    });

    let rl = readline.createInterface({
      input: process.stdin,
      output: outputStream,
      terminal: true,
    });

    rl.question(`${query} `, function(userInput: string) {
      resolve(userInput);
      if (showAstrisk) {
        process.stdout.write('\n');
      }
      rl.close();
    });

    mutedOutput = showAstrisk;
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
  res = await getQuery(queryString, flagConfig.showAstrisk === true);

  if (res === '' && defaultValue) {
    res = defaultValue;
  }

  return res;
}
