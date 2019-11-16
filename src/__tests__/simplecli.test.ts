import {execSync} from 'child_process';
import {FlagsObjectType, FlagConfigType, ParsedResultType} from '../types';
import {SimpleCLI} from '../simplecli';

type TestFlagObjType = FlagsObjectType<'test'>;

const parse = (
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

function cmd(command: string): string {
  let out = '';
  try {
    out = String(execSync(command));
  } catch (e) {
    console.log('An error had occurred while processing the command');
  }
  return out;
}

const defaultFlagConfig: FlagConfigType = {
  alias: '-t',
  flag: '--test',
  description: 'test flag',
};

describe('Test- Parse Configs:', () => {
  let testFlagObj: TestFlagObjType;
  let res: ParsedResultType<TestFlagObjType>;
  let errCodes: number[];
  let inputs: string[][] = [];

  test('argument:false | required:false', () => {
    testFlagObj = {
      test: {
        ...defaultFlagConfig,
      },
    };

    inputs = [];
    inputs.forEach((input) => {
      [res, errCodes] = parse(input, testFlagObj);
      expect(res.test).toBe(undefined);
      expect(errCodes.length).toBe(0);
    });

    testFlagObj = {
      test: {
        ...defaultFlagConfig,
        argument: false,
        required: false,
        showAstrisk: false,
      },
    };

    inputs.forEach((input) => {
      [res, errCodes] = parse(input, testFlagObj);
      expect(res.test).toBe(undefined);
      expect(errCodes.length).toBe(0);
    });

    inputs = [['-t'], ['--test']];
    inputs.forEach((input) => {
      [res, errCodes] = parse(input, testFlagObj);
      expect(res.test).toBe('test');
      expect(errCodes.length).toBe(0);
    });
  });

  test('argument:false | required:true', () => {
    testFlagObj = {
      test: {
        ...defaultFlagConfig,
        required: true,
      },
    };

    inputs = [];
    inputs.forEach((input) => {
      [res, errCodes] = parse(input, testFlagObj);
      expect(res.test).toBe(undefined);
      expect(errCodes.length).toBe(1);
      expect(errCodes[0]).toBe(102);
    });

    inputs = [['-t'], ['--test']];
    inputs.forEach((input) => {
      [res, errCodes] = parse(input, testFlagObj);
      expect(res.test).toBe('test');
      expect(errCodes.length).toBe(0);
    });

    inputs = [
      ['-t', 'testArg'],
      ['--test', 'testArg'],
    ];
    inputs.forEach((input) => {
      [res, errCodes] = parse(input, testFlagObj);
      expect(res.test).toBe('test');
      expect(errCodes.length).toBe(1);
      expect(errCodes[0]).toBe(103);
    });
  });

  test('argument:true | required:false', () => {
    testFlagObj = {
      test: {
        ...defaultFlagConfig,
        argument: true,
      },
    };

    inputs = [];
    inputs.forEach((input) => {
      [res, errCodes] = parse(input, testFlagObj);
      expect(res.test).toBe(undefined);
      expect(errCodes.length).toBe(0);
    });

    inputs = [['-t'], ['--test']];
    inputs.forEach((input) => {
      [res, errCodes] = parse(input, testFlagObj);
      expect(res.test).toBe(undefined);
      expect(errCodes.length).toBe(1);
      expect(errCodes[0]).toBe(101);
    });

    inputs = [
      ['-t', 'testArg'],
      ['--test', 'testArg'],
    ];
    inputs.forEach((input) => {
      [res, errCodes] = parse(input, testFlagObj);
      expect(res.test).toBe('testArg');
      expect(errCodes.length).toBe(0);
    });
  });

  test('argument:true | required:true', () => {
    testFlagObj = {
      test: {
        ...defaultFlagConfig,
        argument: true,
        required: true,
      },
    };

    inputs = [];
    inputs.forEach((input) => {
      [res, errCodes] = parse(input, testFlagObj);
      expect(res.test).toBe(undefined);
      expect(errCodes.length).toBe(1);
      expect(errCodes[0]).toBe(102);
    });

    inputs = [['-t'], ['--test']];
    inputs.forEach((input) => {
      [res, errCodes] = parse(input, testFlagObj);
      expect(res.test).toBe(undefined);
      expect(errCodes.length).toBe(1);
      expect(errCodes[0]).toBe(101);
    });

    inputs = [
      ['-t', 'testArg'],
      ['--test', 'testArg'],
    ];
    inputs.forEach((input) => {
      [res, errCodes] = parse(input, testFlagObj);
      expect(res.test).toBe('testArg');
      expect(errCodes.length).toBe(0);
    });
  });

  test('argument:true | required:true | Invalid Arg', () => {
    testFlagObj = {
      test: {
        ...defaultFlagConfig,
        argument: true,
        required: true,
      },
    };

    inputs = [
      ['-t', 'testArg', '-i'],
      ['--test', 'testArg', '--invalid'],
    ];
    inputs.forEach((input) => {
      [res, errCodes] = parse(input, testFlagObj);
      expect(res.test).toBe('testArg');
      expect(errCodes.length).toBe(1);
      expect(errCodes[0]).toBe(103);
    });
  });
});
