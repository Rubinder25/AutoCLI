import {FlagConfigType, ParsedResultType, FlagsObjectType} from '../types';
import {parse, runCLI} from './testutil';
import {generateHelp} from '../utils';

const defaultFlagConfig: FlagConfigType = {
  alias: '-t',
  flag: '--test',
  description: 'test flag',
};

describe('Test - parse():', () => {
  let testFlagObj: FlagsObjectType;
  let res: ParsedResultType<FlagsObjectType>;
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
        maskInput: undefined,
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

describe('Test - interactive()', () => {
  test('Test - interactive()', async () => {
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
      'ts-node ./src/__tests__/testRunners/testFlags.ts',
      [],
      input,
    ).then((output) => {
      expect(output).toMatchSnapshot();
    });
  });

  test('Test - interactive() | enter empty when the flag is required', async () => {
    const input = [
      'source',
      '',
      'my pass',
      '',
      '',
      'req_source',
      '',
      'req_pass',
      'y',
      'Y',
      'yes',
      'Yes',
      'n',
      'invalidString',
      '',
      '',
      'y_required',
    ];

    return runCLI(
      'ts-node ./src/__tests__/testRunners/testFlags.ts',
      [],
      input,
    ).then((output) => {
      expect(output).toMatchSnapshot();
    });
  });
});

describe('Test - Help', () => {
  let testFlagObj: any;

  test('no usage | no command', async () => {
    testFlagObj = {
      test: {...defaultFlagConfig},
    };

    const help = generateHelp('Test Program', testFlagObj, '');
    expect(help).toMatchSnapshot();
  });

  test('Only Options', async () => {
    testFlagObj = {
      test: {...defaultFlagConfig},
    };

    const help = generateHelp('Test Program', testFlagObj, '');
    expect(help).toMatchSnapshot();
  });

  test('Only Command', async () => {
    testFlagObj = {
      command: {
        alias: 'c',
        flag: 'command',
        description: 'command',
      },
    };

    const help = generateHelp('Test Program', testFlagObj, '');
    expect(help).toMatchSnapshot();
  });

  test('Options and Command', async () => {
    testFlagObj = {
      test: {...defaultFlagConfig},
      command: {
        alias: 'c',
        flag: 'command',
        description: 'command',
      },
    };

    const help = generateHelp('Test Program', testFlagObj, '');
    expect(help).toMatchSnapshot();
  });

  test('Usage defined', async () => {
    testFlagObj = {
      test: {...defaultFlagConfig},
      command: {
        alias: 'c',
        flag: 'command',
        description: 'command',
      },
    };

    const help = generateHelp('Test Program', testFlagObj, 'my custom usage');
    expect(help).toMatchSnapshot();
  });
});

describe('Test - Constructor', () => {
  test('-h | name: provided | version: provided', async () => {
    return runCLI(
      'ts-node ./src/__tests__/testRunners/name_version_provided.ts',
      ['-h'],
      [],
    ).then((output) => {
      expect(output).toMatchSnapshot();
    });
  });

  test('--help | name: not provided | version: not provided', async () => {
    return runCLI(
      'ts-node ./src/__tests__/testRunners/name_version_not_provided.ts',
      ['--help'],
      [],
    ).then((output) => {
      expect(output).toMatchSnapshot();
    });
  });

  test('-v | name: provided | version: provided', async () => {
    return runCLI(
      'ts-node ./src/__tests__/testRunners/name_version_provided.ts',
      ['-v'],
      [],
    ).then((output) => {
      expect(output).toMatchSnapshot();
    });
  });

  test('--version | name: not provided | version: not provided', async () => {
    return runCLI(
      'ts-node ./src/__tests__/testRunners/name_version_not_provided.ts',
      ['--version'],
      [],
    ).then((output) => {
      expect(output).toMatchSnapshot();
    });
  });
});

describe('Test - Flag Overrides', () => {
  test('flag overriden | -h', async () => {
    return runCLI(
      'ts-node ./src/__tests__/testRunners/flag_overrides.ts',
      ['-h'],
      [],
    ).then((output) => {
      expect(output).toMatchSnapshot();
    });
  });

  test('flag overriden | --help', async () => {
    return runCLI(
      'ts-node ./src/__tests__/testRunners/flag_overrides.ts',
      ['--help'],
      [],
    ).then((output) => {
      expect(output).toMatchSnapshot();
    });
  });

  test('flag overriden | -v', async () => {
    return runCLI(
      'ts-node ./src/__tests__/testRunners/flag_overrides.ts',
      ['-v'],
      [],
    ).then((output) => {
      expect(output).toMatchSnapshot();
    });
  });

  test('flag overriden | --version', async () => {
    return runCLI(
      'ts-node ./src/__tests__/testRunners/flag_overrides.ts',
      ['--version'],
      [],
    ).then((output) => {
      expect(output).toMatchSnapshot();
    });
  });
});
