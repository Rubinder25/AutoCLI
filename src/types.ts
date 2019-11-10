export interface FlagObjectOptions {
  flag: string;
  alias: string;
  desc: string;
  value: boolean;
  req?: boolean; // default should be false
}

export type FlagsObjectType<T extends any> = {
  [key in T]: FlagObjectOptions;
};

export type FlagValType = string | boolean | undefined;

export interface ErrorType {
  display: string;
  flag: string;
  code: number;
}

export type ParseType = <T extends FlagsObjectType<any>>(
  cliInputArr: string[],
  flags: T,
  onError: (err: ErrorType) => void,
) => {[key in keyof T]: FlagValType};
