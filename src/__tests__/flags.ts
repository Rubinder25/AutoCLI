import {FlagsObjectType} from '../types';

type flagKeys = 'sandwich' | 'wrap' | 'bread' | 'sauce' | 'salt' | 'pepper';

const flags: FlagsObjectType<flagKeys> = {
  bread: {
    alias: '-b',
    flag: '--bread',
    description: 'type of bread',
    argument: true,
    required: true,
  },
};
