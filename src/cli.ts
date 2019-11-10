import path from 'path';
import {generateHelp, generateVersion, findVersion, getMappings} from './common';
import {ParseType, FlagsObjectType, FlagValType, ErrorType} from './types';

class AutoCLI {
  public parse: ParseType;

  public constructor(psProgramName?: string, psVersion?: string) {
    const programName = psProgramName || path.basename(process.argv[1]);
    const version = psVersion || findVersion() || 'not found';
    const errors: ErrorType[] = [];

    function parse<T extends FlagsObjectType<any>>(
      cliInputArr: string[],
      flags: T,
      onError: (err: ErrorType) => void,
    ): {[key in keyof T]: FlagValType} {
      const res = {} as {[key in keyof T]: FlagValType};
      const flagMappings = getMappings(cliInputArr);

      for (const key in flags) {
        if ((flags as any).hasOwnProperty(key)) {
          const flagOptions = flags[key];
          let flagVal: FlagValType = undefined;

          const indexFlag =
            flagMappings[flagOptions.flag] !== undefined ? flagMappings[flagOptions.flag] : -1;
          const indexAlias =
            flagMappings[flagOptions.alias] !== undefined ? flagMappings[flagOptions.alias] : -1;

          delete flagMappings[flagOptions.flag];
          delete flagMappings[flagOptions.alias];

          const lastIndex = Math.max(indexFlag, indexAlias);

          if (lastIndex !== -1) {
            flagVal = true;

            if (flagOptions.value) {
              flagVal = cliInputArr[lastIndex + 1];

              delete flagMappings[cliInputArr[lastIndex + 1]];

              if (!flagVal) {
                errors.push({display: `${key} requires a value (err: 101)`, flag: key, code: 101});
              }
            }
          } else {
            if (flagOptions.req) {
              errors.push({display: `${key} is required (err: 102)`, flag: key, code: 102});
            }
          }
          res[key] = flagVal;
        }
      }

      if (flagMappings.hasOwnProperty('-h') || flagMappings.hasOwnProperty('--help')) {
        process.stdout.write(generateHelp(programName, flags));
        process.exit(0);
      }

      if (flagMappings.hasOwnProperty('-v') || flagMappings.hasOwnProperty('--version')) {
        process.stdout.write(generateVersion(version));
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

// =====================================================================================
type flagTypes = 'delete' | 'pizzaType2' | 'source';

const flags: FlagsObjectType<flagTypes> = {
  delete: {
    flag: '--delete',
    alias: '-d',
    desc: 'delete it',
    value: false,
    req: true,
  },
  pizzaType2: {
    flag: '--pizza-type',
    alias: '-p',
    desc: 'pizza type',
    req: true,
    value: true,
  },
  source: {
    flag: '--source',
    alias: '-s',
    desc: 'pizza type',
    value: true,
  },
};

const autoCli = new AutoCLI();
const b = autoCli.parse(process.argv.slice(2), flags, (err) => console.log(err.display));
console.log(b);
