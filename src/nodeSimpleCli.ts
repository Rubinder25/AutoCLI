import path from 'path';
import {
  generateHelp,
  getVersion,
  findVersion,
  getMappings,
  getInput,
  clearLine,
  isOption,
} from './utils';
import {
  ParseFuncType,
  FlagsObjectType,
  ErrorType,
  ParsedResultType,
  InteractiveModeQAFuncType,
} from './types';
import chalk, {Chalk} from 'chalk';

export class NodeSimpleCLI {
  public usage: (usageString: string) => void;
  public parse: ParseFuncType;
  public interactive: InteractiveModeQAFuncType;

  public constructor(psProgramName?: string, psVersion?: string) {
    const programName = psProgramName || path.basename(process.argv[1]);
    const version = psVersion || findVersion() || 'not found';
    let usageString = '';

    function usage(s: string): void {
      usageString = s;
    }

    function parse<T extends FlagsObjectType>(
      cliInputArr: string[],
      flags: T,
      onError: (err: ErrorType) => void,
    ): ParsedResultType<T> {
      const res = {} as ParsedResultType<T>;
      const errors: ErrorType[] = [];
      res.args = [];
      const eof = '--'; // end of flags
      const flagsLimit = cliInputArr.includes(eof)
        ? cliInputArr.indexOf(eof)
        : cliInputArr.length;

      const recievedFlags = getMappings(cliInputArr);
      delete recievedFlags[eof];

      for (const key in flags) {
        if (flags.hasOwnProperty(key)) {
          const flagConfig = flags[key];
          let resVal = undefined;

          const indexFlag =
            recievedFlags[flagConfig.flag] !== undefined
              ? recievedFlags[flagConfig.flag]
              : -1;
          const indexAlias =
            recievedFlags[flagConfig.alias] !== undefined
              ? recievedFlags[flagConfig.alias]
              : -1;

          delete recievedFlags[flagConfig.flag];
          delete recievedFlags[flagConfig.alias];

          const lastIndex = Math.max(indexFlag, indexAlias);

          if (lastIndex !== -1 && lastIndex < flagsLimit) {
            resVal = key;

            if (flagConfig.argument) {
              resVal = cliInputArr[lastIndex + 1];

              delete recievedFlags[cliInputArr[lastIndex + 1]];

              if (!resVal) {
                errors.push({
                  display: `${key} requires a value`,
                  flag: key,
                  code: 101,
                });
              }
            }
          } else {
            if (flagConfig.required) {
              errors.push({
                display: `${key} is required`,
                flag: key,
                code: 102,
              });
            }
          }
          res[key] = resVal as any;
        }
      }

      // process recievedFlags which were not present in the flags object
      if (
        recievedFlags.hasOwnProperty('-h') ||
        recievedFlags.hasOwnProperty('--help')
      ) {
        process.stdout.write(generateHelp(programName, flags, usageString));
        process.exit(0);
      }

      if (
        recievedFlags.hasOwnProperty('-v') ||
        recievedFlags.hasOwnProperty('--version')
      ) {
        process.stdout.write(getVersion(version));
        process.exit(0);
      }

      Object.keys(recievedFlags).forEach((key) => {
        if (recievedFlags[key] < flagsLimit) {
          if (isOption(key)) {
            errors.push({
              display: `${key} is not a valid option`,
              flag: key,
              code: 103,
            });
          } else {
            res.args.push(key);
          }
        }

        delete recievedFlags[key];
      });

      for (let i = flagsLimit + 1; i < cliInputArr.length; i++) {
        res.args.push(cliInputArr[i]);
      }

      errors.forEach((err) => {
        onError(err);
      });

      return res;
    }

    async function interactive<T extends FlagsObjectType>(
      flags: T,
      color?: Chalk,
    ): Promise<ParsedResultType<T>> {
      const res = {} as ParsedResultType<T>;

      for (const key in flags) {
        if (flags.hasOwnProperty(key)) {
          const flagConfig = flags[key];
          let resVal = undefined;
          let askCount = 0;
          let inputVal = '';

          do {
            let secondaryString = '';

            if (!flagConfig.argument) {
              secondaryString += ' (y/n)';
            }

            if (askCount > 0) {
              clearLine();
              secondaryString += ` ${chalk.yellow('(required)')}`;
            }

            let queryString = `${key}${secondaryString}:`;
            queryString = color ? color(queryString) : queryString;
            inputVal = await getInput(queryString, flagConfig.maskInput);
            resVal = inputVal;

            if (resVal === '') {
              resVal = undefined;
            }

            if (!flagConfig.argument) {
              if (
                resVal &&
                (resVal.toLowerCase() === 'y' || resVal.toLowerCase() === 'yes')
              ) {
                resVal = key;
              } else {
                resVal = undefined;
              }
            }
            askCount++;
          } while (inputVal === '' && flagConfig.required);

          res[key] = resVal as any;
        }
      }

      return res;
    }

    this.usage = usage;
    this.parse = parse;
    this.interactive = interactive;
  }
}
