import {spawn} from 'cross-spawn';
import {FlagsObjectType, ParsedResultType} from '../types';
import {NodeSimpleCLI} from '../nodeSimpleCli';

export const parse = (
  input: string[],
  testFlagObj: FlagsObjectType,
): [ParsedResultType<FlagsObjectType>, number[]] => {
  const simpleCLI = new NodeSimpleCLI('Test Program', '1.0.0');
  let errCodes: number[] = [];

  const res = simpleCLI.parse(input, testFlagObj, (err) => {
    errCodes.push(err.code);
  });

  return [res, errCodes];
};

export function waitSync(time: number): void {
  const currTime = new Date().getTime();
  while (new Date().getTime() - currTime <= time) {
    //
  }
}

export const runCLI = (
  cmd: string,
  args: string[],
  inputLines: string[],
  liveOutput?: boolean,
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args);
    let childOutput = '';

    child.stdout.on('data', (data) => {
      childOutput += data;

      liveOutput && process.stdout.write(data.toString());

      if (inputLines) {
        child.stdin.write(inputLines.splice(0, 1) + '\n');
        waitSync(5);
      }
    });

    child.on('close', () => {
      resolve(childOutput);
    });

    child.on('error', (err) => {
      reject(err);
    });
  });
};
