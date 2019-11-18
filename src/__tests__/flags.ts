import {FlagsObjectType} from '../types';

type flagKeys = 'sandwich' | 'wrap' | 'bread' | 'sauce' | 'salt' | 'pepper';

const flags: FlagsObjectType<flagKeys> = {
  sandwich: {
    alias: 's',
    flag: 'sandwich',
    description: 'Sandwich',
  },
  wrap: {
    alias: 'w',
    flag: 'wrap',
    description: 'Wrap',
    showAstrisk: true,
  },
  bread: {
    alias: '-b',
    flag: '--bread',
    description: 'type of bread',
    argument: true,
    required: true,
    showAstrisk: false,
  },
  pepper: {
    alias: '-p',
    flag: '--pepper',
    description: 'pepper',
    showAstrisk: true,
  },
  salt: {
    alias: '-s',
    flag: '--salt',
    description: 'salt',
  },
  sauce: {
    alias: '-e',
    flag: '--sauce',
    description: 'sauce',
    argument: true,
  },
};

export default flags;
