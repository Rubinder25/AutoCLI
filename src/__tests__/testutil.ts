import {spawn} from 'cross-spawn';
import {FlagsObjectType, FlagConfigType, ParsedResultType} from '../types';
import {SimpleCLI} from '../simplecli';

export type TestFlagObjType = FlagsObjectType<'test'>;

export const parse = (
  input: string[],
  testFlagObj: TestFlagObjType,
): [ParsedResultType<TestFlagObjType>, number[]] => {
  const simpleCLI = new SimpleCLI('Test Program', '1.0.0');
  let errCodes: number[] = [];

  const res = simpleCLI.parse(input, testFlagObj, (err) => {
    errCodes.push(err.code);
  });

  return [res, errCodes];
};

export const runCLI = (cmd: string, inputLines: string[]): Promise<string> => {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd);
    let childOutput = '';

    inputLines.forEach((input) => {
      child.stdin.write(input + '\n');
    });

    child.stdout.on('data', (data) => {
      childOutput += data;
    });

    child.on('close', () => {
      resolve(childOutput);
    });

    child.on('error', (err) => {
      reject(err);
    });
  });
};
