import {FlagsObjectType} from '../types';

type keys =
  | 'souce-string'
  | 'souce-empty'
  | 'password-string'
  | 'password-empty'
  | 'required_souce-emtpy_string'
  | 'f2-y'
  | 'f2-Y'
  | 'f2-yes'
  | 'f2-Yes'
  | 'f3-n'
  | 'f3-invalidString'
  | 'f4-empty'
  | 'f5-required';

const flags: FlagsObjectType<keys> = {
  'souce-string': {
    alias: '-a',
    flag: '--source-string',
    description: 'source string',
  },
  'souce-empty': {
    alias: '-b',
    flag: '-source-empty',
    description: 'source empty',
  },
  'password-string': {
    alias: '-c',
    flag: '--password-string',
    description: 'password string',
  },
  'password-empty': {
    alias: '-d',
    flag: '--password-empty',
    description: 'password empty',
  },
  'required_souce-emtpy_string': {
    alias: '-e',
    flag: '--required_souce-emtpy_string',
    description: 'required_souce-emtpy_string',
  },
};

export default flags;
