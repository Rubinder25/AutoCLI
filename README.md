# Simple CLI

Utility to create command-line programs.

## Install

```
npm i nodesimplecli
```

## Flags Object

We first need to define the flags which will be used by our application. The flag object will contain definitions of all the commands and flags.

```js
const flags = {
  bread: {
    alias: '-b',
    flag: '--bread',
    description: 'type of bread',
    argument: true,
    required: true,
  },
  salad: {
    alias: '-s',
    flag: '--salad',
    description: 'add salad',
  },
};

const response = program.parse(process.argv.slice(2), flags, (err) =>
  console.log(err.display),
);

// the response object will have all properties of flags attached to it with values
console.log(response);
```

### Add Typescript support to flags

```typescript
type keys = 'bread' | 'salad';

const flags: FlagsObjectType<keys> = {
  bread: {
    alias: '-b',
    flag: '--bread',
    description: 'type of bread',
    argument: true,
    required: true,
  },
  salad: {
    alias: '-s',
    flag: '--salad',
    description: 'add salad',
  },
};
```

## Initialize the object

```js
import {SimpleCLI} from 'nodesimplecli';

const program = new SimpleCLI('My Program', '1.0.0');

const response = program.parse(process.argv.slice(2), flags, (err) =>
  console.log(err.display),
);
```

## In Action

To see it in action let's build a small cli utility to gather information about sandwich order.

```js
import {SimpleCLI, FlagsObjectType, ErrorType} from 'nodesimplecli';

type keys = 'bread' | 'salad' | 'sauce' | 'cheese';

const flags: FlagsObjectType<keys> = {
  bread: {
    alias: '-b',
    flag: '--bread',
    description: 'type of bread',
    argument: true,
    required: true,
  },
  salad: {
    alias: '-s',
    flag: '--salad',
    description: 'add salad',
  },
  sauce: {
    alias: '-u',
    flag: '--sauce',
    description: 'add sauce',
  },
  cheese: {
    alias: '-c',
    flag: '--cheese',
    description: 'add cheese',
  },
};

const cli = new SimpleCLI('subway', '1.0.0');

const onError = (err: ErrorType) => {
  console.log(err.display);
  process.exit(1);
};

const program = cli.parse(process.argv.slice(2), flags, onError);

console.log(
  'You have ordered a sandwich:',
  program.bread + ' bread',
  program.salad ? '+ salad' : '',
  program.sauce ? '+ sauce' : '',
  program.cheese ? '+ cheese' : '',
);
```

## Flags

### Commands

If in flag config `alias` and `flag` have '-' then it is considered as options. If it doesn't begin with '-' then it is considered as command.

### Argument vs Boolean flags

Flags can accept arguments to be passed, this can be done by setting `argument: true` in the flag config, e.g. in the above program the flag `bread` requires an argument(type of bread) to be passed, while the rest of the flags are boolean flags. A boolean flag doesn't require an argument they are either present or not.

### Boolean flags Shorthand

Multiple boolean flags can be combined together e.g. `-c -u -s` can also be passed in as `-cus`.

### Required Flags

If a flag has `required: true` then it becomes a required flag and if it is not present in the cli input `onError` will receive error.

## Auto generated Help

The program auto generates help menu if `-h` or `--help` flags are passed.

e.g. if the above program is run with `-h` flag the following output is received:-

```
terminal> node subway.js -h

Usage: subway [options]

Options:
  -b, --bread <val>  type of bread
  -s, --salad        add salad
  -u, --sauce        add sauce
  -c, --cheese       add cheese
  -h, --help         help
  -v, --version      version
```

### Usage

The usage can be customized by calling `usage` method.

```js
cli.usage('my custom usage');
```

```
terminal> node subway.js -h

Usage: subway my custom usage

Options:
  -b, --bread <val>  type of bread
  -s, --salad        add salad
  -u, --sauce        add sauce
  -c, --cheese       add cheese
  -h, --help         help
  -v, --version      version
```

## Auto generated version

If the program is run with `-v` or `--version` flag it shows the version of the program.

The version is passed in constructor of `SimpleCLI`.

### Use version from `Package.json`

If the version is not passed into constructor, the program use the version in `Package.json`.

## Override help and version flags

The program handles `-v` or `--version` and `-h` or `--help` automatically. However, these can be overwritten by having these flags in the `flags` object passed to the `parse` function.

The following will prevent `SimpleCLI` from handling these flags automatically and you can handle these in your program:-

```js
const flags = {
.
.
.

  help: {
    alias: '-h',
    flag: '--help',
    description: 'help',
  },
  version: {
    alias: '-v',
    flag: '--version',
    description: 'version',
  },
};

const program = cli.parse(process.argv.slice(2), flags, onError);
```

## Interactive Mode

`SimpleCLI` consists of an interactive mode, which displays the flags in QA form to the user.

```js
const program = await cli.interactive(flags);

// an optional color property can also be passed to it

const program = await cli.interactive(flags, chalk.blue);
```

```
terminal> node subway.js

bread: Italian
salad (y/n): y
sauce (y/n): n
cheese (y/n): y

You have ordered a sandwich: Italian bread + salad  + cheese
```

### Required

While in interactive mode if a flag has `required: true`, the value for that program becomes mandatory and an empty value will not be accepted for that flag.

e.g.:-

```
bread (required):
```

## Errors

List of errors `parse` function can call the callback for:-

| Code | Error                                |
| ---- | ------------------------------------ |
| 101  | An argument for flag is not provided |
| 102  | The flag is required                 |
| 103  | An invalid flag is passed            |
