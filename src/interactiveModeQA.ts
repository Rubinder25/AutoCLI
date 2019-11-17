import readline from 'readline';
import stream, {Readable} from 'stream';
import {FlagConfigType} from './types';

/**
 * returns user input,
 * in case the user doesn't enter anything,
 * an empty string is returned
 * @param query string
 * @param showAstrisk boolean
 * @returns string
 */
function getInput(query: string, showAstrisk: boolean): Promise<string> {
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
  const defaultValue = flagConfig.default;
  let secondaryString = '';

  if (defaultValue) {
    secondaryString = defaultValue !== undefined ? `(${defaultValue})` : '';
  }

  // if flag is of type boolean then it can't have a default value
  if (!flagConfig.argument) {
    secondaryString = '(y/n)';
  }

  const queryString = `${key}: ${secondaryString}`;
  res = await getInput(queryString, flagConfig.showAstrisk || false);

  if (res === '') {
    if (defaultValue) {
      res = defaultValue;
    } else {
      res = undefined;
    }
  }

  if (!flagConfig.argument) {
    if (res && (res.toLowerCase() === 'y' || res.toLowerCase() === 'yes')) {
      res = key;
    } else {
      res = undefined;
    }
  }

  return res;
}
