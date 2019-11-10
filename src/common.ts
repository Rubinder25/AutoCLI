import os from 'os';
import fs from 'fs';
import path from 'path';
import {FlagsObjectType} from './types';

const fixedWidth = (s: string, w: number): string => {
  if (s.length === w) {
    return s;
  }

  if (s.length > w) {
    return s.slice(0, w);
  }

  let spaces = '';
  for (let i = 0; i < w - s.length; i++) {
    spaces += ' ';
  }
  s += spaces;

  return s;
};

export const findVersion = (): string | undefined => {
  let version = undefined;
  let currDir = process.argv[1];
  let parentDir = path.dirname(currDir);

  while (currDir !== parentDir && version === undefined) {
    const packageJSONPath = path.join(currDir, 'package.json');

    if (fs.existsSync(packageJSONPath)) {
      const packageJSONFile = fs.readFileSync(packageJSONPath, 'utf-8');
      version = JSON.parse(packageJSONFile).version;
    }

    currDir = parentDir;
    parentDir = path.dirname(currDir);
  }

  return version;
};

export const getMappings = (cliInputArr: string[]): {[key: string]: number} => {
  const flagMappings: {[key: string]: number} = {};
  for (let i = 0; i < cliInputArr.length; i++) {
    const input = cliInputArr[i];

    if (input[0] === '-' && input[1] !== '-') {
      for (let j = 1; j < input.length; j++) {
        const flagRecieved = input[j];
        flagMappings[`-${flagRecieved}`] = i;
      }
    } else {
      flagMappings[input] = i;
    }
  }

  return flagMappings;
};

export const generateHelp = (programName: string, flags: FlagsObjectType<any>): string => {
  const EOL = os.EOL;
  let help = `${EOL}Usage: ${programName} [options]${EOL}${EOL}`;
  help += `Options:${EOL}`;

  let displayOptionsCOL1 = 0;
  let displayOptionsCOL2 = 0;
  let displayOptionsCOL3 = 0;

  for (const key in flags) {
    if (flags.hasOwnProperty(key)) {
      const flagOptions = flags[key];
      displayOptionsCOL1 = Math.max(displayOptionsCOL1, flagOptions.alias.length);
      displayOptionsCOL2 = Math.max(
        displayOptionsCOL2,
        flagOptions.flag.length + (flagOptions.req ? 6 : 0),
      );
      displayOptionsCOL3 = Math.max(displayOptionsCOL3, flagOptions.desc.length);
    }
  }

  for (const key in flags) {
    if (flags.hasOwnProperty(key)) {
      const flagOptions = flags[key];
      help += fixedWidth(`  ${flagOptions.alias},`, displayOptionsCOL1 + 3);
      help += fixedWidth(
        ` ${flagOptions.flag} ${flagOptions.req ? '<val>' : ''}`,
        displayOptionsCOL2 + 1,
      );
      help += fixedWidth(`  ${flagOptions.desc}`, displayOptionsCOL3 + 2);
      help += EOL;
    }
  }

  return help;
};

export const generateVersion = (version: string): string => {
  return `version: ${version}`;
};
