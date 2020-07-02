import {Chalk} from 'chalk';

export interface FlagConfigType {
  flag: string;
  alias: string;
  description: string;
  argument?: boolean; // default should be false
  required?: boolean; // default should be false
  maskInput?: string; // default should be false
}

export type FlagsObjectType = {
  [key in string]: FlagConfigType;
};

export type ParsedResultType<T> = {[key in keyof T]: string | undefined} & {
  args: string[];
};

export interface ErrorType {
  display: string;
  flag: string;
  code: number;
}

export type ParseFuncType = <T extends FlagsObjectType>(
  cliInputArr: string[],
  flags: T,
  onError: (err: ErrorType) => void,
) => ParsedResultType<T>;

export type InteractiveModeQAFuncType = <T extends FlagsObjectType>(
  flags: T,
  color?: Chalk,
) => Promise<ParsedResultType<T>>;

export type CreateFlagsReturnType<T> = {
  [key in keyof T]: FlagConfigType;
};
