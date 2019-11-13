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
      const flagMappings = getMappings(cliInputArr);

      for (const key in flags) {
        if ((flags as any).hasOwnProperty(key)) {
          const flagOptions = flags[key];
          let flagVal = undefined;

          const indexFlag =
            flagMappings[flagOptions.flag] !== undefined ? flagMappings[flagOptions.flag] : -1;
          const indexAlias =
            flagMappings[flagOptions.alias] !== undefined ? flagMappings[flagOptions.alias] : -1;

          delete flagMappings[flagOptions.flag];
          delete flagMappings[flagOptions.alias];

          const lastIndex = Math.max(indexFlag, indexAlias);

          if (lastIndex !== -1) {
            flagVal = key;

            if (flagOptions.argument) {
              flagVal = cliInputArr[lastIndex + 1];

              delete flagMappings[cliInputArr[lastIndex + 1]];

              if (!flagVal) {
                errors.push({display: `${key} requires a value (err: 101)`, flag: key, code: 101});
              }
            }
          } else {
            if (flagOptions.required) {
              errors.push({display: `${key} is required (err: 102)`, flag: key, code: 102});
            }
          }
          res[key] = flagVal;
        }
      }

      if (flagMappings.hasOwnProperty('-h') || flagMappings.hasOwnProperty('--help')) {
        process.stdout.write(getHelp(programName, flags));
        process.exit(0);
      }

      if (flagMappings.hasOwnProperty('-v') || flagMappings.hasOwnProperty('--version')) {
        process.stdout.write(getVersion(version));
        process.exit(0);
      }

      Object.keys(flagMappings).forEach((key) => {
        errors.push({display: `${key} is not a valid option (err: 103)`, flag: key, code: 103});
        delete flagMappings[key];
      });

      errors.forEach((err) => {
        onError(err);
      });

      return res;
    }

    this.parse = parse;
  }
}
