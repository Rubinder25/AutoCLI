import os from 'os';
import fs from 'fs';
import path from 'path';
import {FlagsObjectType, FlagConfigType} from './types';

const helpFlag: FlagConfigType = {
  alias: '-h',
  flag: '--help',
  description: 'help',
};

const versionFlag: FlagConfigType = {
  alias: '-v',
  flag: '--version',
  description: 'version',
};

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

const getRow = (flagConfig: FlagConfigType): string[] => {
  return [
    `  ${flagConfig.alias},`,
    ` ${flagConfig.flag} ${flagConfig.required ? '<val>' : ''}`,
    `  ${flagConfig.description}`,
  ];
};

export const isOption = (option: string): boolean => {
  return option.charAt(0) === '-';
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

export const generateTable = (header: string, data: string[][]): string => {
  const EOL = os.EOL;
  const nColWidth: number[] = Array(data[0].length).fill(0);
  let table: string = EOL + header + EOL;

  data.forEach((row) => {
    row.forEach((cell, j) => {
      nColWidth[j] = Math.max(nColWidth[j], cell.length);
    });
  });

  data.forEach((row) => {
    row.forEach((cell, j) => {
      table += fixedWidth(cell, nColWidth[j]);
    });
    table += EOL;
  });

  return table;
};

export const generateHelp = (programName: string, flags: FlagsObjectType<any>): string => {
  const EOL = os.EOL;
  let help = `${EOL}Usage: ${programName} [options]${EOL}`;

  const commands: string[][] = [];
  const options: string[][] = [];
  let hasHelp = false;
  let hasVersion = false;

  for (const key in flags) {
    let selectedCategory: string[][];

    if (flags.hasOwnProperty(key)) {
      const flagOptions = flags[key];
      if (isOption(flagOptions.alias) && isOption(flagOptions.flag)) {
        selectedCategory = options;
      } else {
        selectedCategory = commands;
      }

      selectedCategory.push(getRow(flagOptions));

      if (flagOptions.alias === '-h' && flagOptions.flag === '--help') {
        hasHelp = true;
      }

      if (flagOptions.alias === '-v' && flagOptions.flag === '--version') {
        hasVersion = true;
      }
    }
  }

  if (!hasHelp) {
    options.push(getRow(helpFlag));
  }

  if (!hasVersion) {
    options.push(getRow(versionFlag));
  }

  if (commands.length > 0) {
    help += generateTable('Commands:', commands);
  }

  if (options.length > 0) {
    help += generateTable('Options:', options);
  }

  return help;
};

export const generateVersion = (version: string): string => {
  return `version: ${version}`;
};
