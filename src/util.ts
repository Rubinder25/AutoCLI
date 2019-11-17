import os from 'os';
import fs from 'fs';
import path from 'path';
import readline from 'readline';
import stream from 'stream';
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

const getFlagRow = (flagConfig: FlagConfigType): string[] => {
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

export const getTable = (header: string, data: string[][]): string => {
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

export const getHelp = (
  programName: string,
  flags: FlagsObjectType<any>,
): string => {
  const EOL = os.EOL;
  let help = `${EOL}Usage: ${programName} [options]${EOL}`;

  const commands: string[][] = [];
  const options: string[][] = [];
  let hasHelp = false;
  let hasVersion = false;

  for (const key in flags) {
    let selectedCategory: string[][];

    if (flags.hasOwnProperty(key)) {
      const flagConfig = flags[key];
      if (isOption(flagConfig.alias) && isOption(flagConfig.flag)) {
        selectedCategory = options;
      } else {
        selectedCategory = commands;
      }

      selectedCategory.push(getFlagRow(flagConfig));

      if (flagConfig.alias === '-h' && flagConfig.flag === '--help') {
        hasHelp = true;
      }

      if (flagConfig.alias === '-v' && flagConfig.flag === '--version') {
        hasVersion = true;
      }
    }
  }

  if (!hasHelp) {
    options.push(getFlagRow(helpFlag));
  }

  if (!hasVersion) {
    options.push(getFlagRow(versionFlag));
  }

  if (commands.length > 0) {
    help += getTable('Commands:', commands);
  }

  if (options.length > 0) {
    help += getTable('Options:', options);
  }

  return help;
};

export const getVersion = (version: string): string => {
  return `version: ${version}`;
};

export const getInput = (
  query: string,
  showAstrisk: boolean,
): Promise<string> => {
  return new Promise((resolve) => {
    let Writable = stream.Writable;
    let mutedOutput = false;

    let outputStream = new Writable({
      write(chunk, _enc, cb) {
        chunk = chunk.toString('utf8');
        if (mutedOutput) {
          process.stdout.write('*');
        } else {
          process.stdout.write(chunk);
        }
        cb();
      },
    });

    let rl = readline.createInterface({
      input: process.stdin,
      output: outputStream,
      terminal: true,
    });

    rl.question(`${query} `, function(userInput: string) {
      resolve(userInput);
      if (showAstrisk) {
        process.stdout.write('\n');
      }
      rl.close();
    });

    mutedOutput = showAstrisk;
  });
};
