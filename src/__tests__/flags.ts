import {FlagsObjectType} from '../types';

type flagKeys = 'sandwich' | 'wrap' | 'bread' | 'sauce' | 'salt' | 'pepper';

const flags: FlagsObjectType<flagKeys> = {
  sandwich: {
    alias: 's',
    flag: 'sandwich',
    description: 'Sandwich',
    default: 'Chicken Classic',
  },
  wrap: {
    alias: 'w',
    flag: 'wrap',
    description: 'Wrap',
  },
  bread: {
    alias: '-b',
    flag: '--bread',
    description: 'type of bread',
    argument: true,
    required: true,
  },
  pepper: {
    alias: '-p',
    flag: '--pepper',
    description: 'pepper',
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
