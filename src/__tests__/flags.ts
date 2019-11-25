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
  | 'f4-empty';

const flags: FlagsObjectType<keys> = {};

export default flags;
