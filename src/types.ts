export interface FlagConfigType {
  flag: string;
  alias: string;
  description: string;
  argument?: boolean; // default should be false
  required?: boolean; // default should be false
  hideInput?: boolean; // default should be false
}

export type FlagsObjectType<T extends any> = {
  [key in T]: FlagConfigType;
};

export type ParsedResultType<T> = {[key in keyof T]: string | undefined};

export interface ErrorType {
  message: string;
  flag: string;
  code: number;
}

export type ParseFuncType = <T extends FlagsObjectType<any>>(
  cliInputArr: string[],
  flags: T,
  onError: (err: ErrorType) => void,
) => ParsedResultType<T>;
