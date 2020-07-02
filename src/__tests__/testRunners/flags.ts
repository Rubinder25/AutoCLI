import {createFlags} from '../../utils';

const flags = createFlags({
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
    maskInput: '*',
  },
  'password-empty': {
    alias: '-d',
    flag: '--password-empty',
    description: 'password empty',
    argument: true,
    maskInput: '*',
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
    maskInput: '*',
  },
  'f1-y': {
    alias: '-g',
    flag: '--f1-y',
    description: 'f1-y',
  },
  'f1-Y': {
    alias: '-i',
    flag: '--f1-Y',
    description: 'f1-Y',
  },
  'f1-yes': {
    alias: '-j',
    flag: '--f1-yes',
    description: 'f1-yes',
  },
  'f1-Yes': {
    alias: '-k',
    flag: '--f1-Yes',
    description: 'f1-Yes',
  },
  'f2-n': {
    alias: '-l',
    flag: '--f2-n',
    description: 'f2-n',
  },
  'f2-invalidString': {
    alias: '-m',
    flag: '--f2-invalidString',
    description: 'f2-invalidString',
  },
  'f3-empty': {
    alias: '-n',
    flag: '--f3-empty',
    description: 'f3-empty',
  },
  'f4-required': {
    alias: '-o',
    flag: '--f4-required',
    description: 'f4-required',
    required: true,
  },
});

export default flags;
