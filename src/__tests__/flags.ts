import {FlagsObjectType} from '../types';

type keys =
  | 'souce-string'
  | 'souce-empty'
  | 'password-string'
  | 'password-empty'
  | 'required_souce-emtpy_string'
  | 'required_password-emtpy_string'
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
    argument: true,
  },
  'souce-empty': {
    alias: '-b',
    flag: '-source-empty',
    description: 'source empty',
    argument: true,
  },
  'password-string': {
    alias: '-c',
    flag: '--password-string',
    description: 'password string',
    argument: true,
  },
  'password-empty': {
    alias: '-d',
    flag: '--password-empty',
    description: 'password empty',
    argument: true,
  },
  'required_souce-emtpy_string': {
    alias: '-e',
    flag: '--required_souce-emtpy_string',
    description: 'required_souce-emtpy_string',
    argument: true,
    required: true,
  },
  'required_password-emtpy_string': {
    alias: '-f',
    flag: '--required_password-emtpy_string',
    description: 'required_password-emtpy_string',
    argument: true,
    required: true,
  },
  'f2-y': {
    alias: '-g',
    flag: '--f2-y',
    description: 'f2-y',
  },
  'f2-Y': {
    alias: '-h',
    flag: '--f2-Y',
    description: 'f2-Y',
  },
  'f2-yes': {
    alias: '-i',
    flag: '--f2-yes',
    description: 'f2-yes',
  },
  'f2-Yes': {
    alias: '-j',
    flag: '--f2-Yes',
    description: 'f2-Yes',
  },
  'f3-n': {
    alias: '-k',
    flag: '--f3-n',
    description: 'f3-n',
  },
  'f3-invalidString': {
    alias: '-l',
    flag: '--f3-invalidString',
    description: 'f3-invalidString',
  },
  'f4-empty': {
    alias: '-m',
    flag: '--f4-empty',
    description: 'f4-empty',
  },
  'f5-required': {
    alias: '-n',
    flag: '--f5-required',
    description: 'f5-required',
    required: true,
  },
};

export default flags;
