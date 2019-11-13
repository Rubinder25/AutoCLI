import path from 'path';
import {getHelp, getVersion, findVersion, getMappings} from './util';
import {ParseFuncType, FlagsObjectType, ErrorType, ParsedResultType} from './types';

export class SimpleCLI {
  public parse: ParseFuncType;

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
            recievedFlags[flagConfig.flag] !== undefined ? recievedFlags[flagConfig.flag] : -1;
          const indexAlias =
            recievedFlags[flagConfig.alias] !== undefined ? recievedFlags[flagConfig.alias] : -1;

          delete recievedFlags[flagConfig.flag];
          delete recievedFlags[flagConfig.alias];

          const lastIndex = Math.max(indexFlag, indexAlias);

          if (lastIndex !== -1) {
            resVal = key;

            if (flagConfig.argument) {
              resVal = cliInputArr[lastIndex + 1];

              delete recievedFlags[cliInputArr[lastIndex + 1]];

              if (!resVal) {
                errors.push({message: `${key} requires a value (err: 101)`, flag: key, code: 101});
              }
            }
          } else {
            if (flagConfig.required) {
              errors.push({message: `${key} is required (err: 102)`, flag: key, code: 102});
            }
          }
          res[key] = resVal;
        }
      }

      // process recievedFlags which were not present in the flags object
      if (recievedFlags.hasOwnProperty('-h') || recievedFlags.hasOwnProperty('--help')) {
        process.stdout.write(getHelp(programName, flags));
        process.exit(0);
      }

      if (recievedFlags.hasOwnProperty('-v') || recievedFlags.hasOwnProperty('--version')) {
        process.stdout.write(getVersion(version));
        process.exit(0);
      }

      Object.keys(recievedFlags).forEach((key) => {
        errors.push({message: `${key} is not a valid option (err: 103)`, flag: key, code: 103});
        delete recievedFlags[key];
      });

      errors.forEach((err) => {
        onError(err);
      });

      return res;
    }

    this.parse = parse;
  }
}
