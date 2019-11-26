import {FlagConfigType, ParsedResultType} from '../types';
import {TestFlagObjType, parse, runCLI} from './testutil';

const defaultFlagConfig: FlagConfigType = {
  alias: '-t',
  flag: '--test',
  description: 'test flag',
};

describe('Test - parse():', () => {
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
      expect(res.args.length).toBe(1);
      expect(res.args[0]).toBe('testArg');
      expect(errCodes.length).toBe(0);
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

  test("args after '--'", () => {
    testFlagObj = {
      test: {
        ...defaultFlagConfig,
      },
    };

    inputs = [['-t', 'arg1', '--', '-arg2', '--arg3', 'arg4']];
    inputs.forEach((input) => {
      [res, errCodes] = parse(input, testFlagObj);
      expect(res.test).toBe('test');
      expect(errCodes.length).toBe(0);
      expect(res.args.length).toBe(4);
      expect(res.args).toEqual(['arg1', '-arg2', '--arg3', 'arg4']);
    });
  });
});

describe('Test - askQA()', () => {
  test('test_1.ts', () => {
    const input = [
      'source',
      '',
      'my pass',
      '',
      'req_source',
      'req_pass',
      'y',
      'Y',
      'yes',
      'Yes',
      'n',
      'invalidString',
      '',
      'y_required',
    ];

    return runCLI(
      'ts-node .\\src\\__tests__\\askQA_tests\\test_1.ts',
      input,
    ).then((output) => {
      expect(output).toMatchSnapshot();
    });
  });
});
