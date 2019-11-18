import path from 'path';
import {
  getHelp,
  getVersion,
  findVersion,
  getMappings,
  getInput,
  clearLine,
} from './util';
import {
  ParseFuncType,
  FlagsObjectType,
  ErrorType,
  ParsedResultType,
  InteractiveModeQAFuncType,
} from './types';
import chalk, {Chalk} from 'chalk';

export class SimpleCLI {
  public parse: ParseFuncType;
  public askQA: InteractiveModeQAFuncType;

  public constructor(psProgramName?: string, psVersion?: string) {
    const programName = psProgramName || path.basename(process.argv[1]);
    const version = psVersion || findVersion() || 'not found';
    const errors: ErrorType[] = [];

    function parse<T extends FlagsObjectType<any>>(
      cliInputArr: string[],
      flags: T,
      onError: (err: ErrorType) => void,
    ): ParsedResultType<T> {
      const res = {} as ParsedResultType<T>;
      const recievedFlags = getMappings(cliInputArr);

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

          if (lastIndex !== -1) {
            resVal = key;

            if (flagConfig.argument) {
              resVal = cliInputArr[lastIndex + 1];

              delete recievedFlags[cliInputArr[lastIndex + 1]];

              if (!resVal) {
                errors.push({
                  display: `${key} requires a value (err: 101)`,
                  flag: key,
                  code: 101,
                });
              }
            }
          } else {
            if (flagConfig.required) {
              errors.push({
                display: `${key} is required (err: 102)`,
                flag: key,
                code: 102,
              });
            }
          }
          res[key] = resVal;
        }
      }

      // process recievedFlags which were not present in the flags object
      if (
        recievedFlags.hasOwnProperty('-h') ||
        recievedFlags.hasOwnProperty('--help')
      ) {
        process.stdout.write(getHelp(programName, flags));
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
        errors.push({
          display: `${key} is not a valid option (err: 103)`,
          flag: key,
          code: 103,
        });
        delete recievedFlags[key];
      });

      errors.forEach((err) => {
        onError(err);
      });

      return res;
    }

    async function askQA<T extends FlagsObjectType<any>>(
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
            inputVal = await getInput(
              queryString,
              flagConfig.showAstrisk || false,
            );
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

          res[key] = resVal;
        }
      }

      return res;
    }

    this.parse = parse;
    this.askQA = askQA;
  }
}
