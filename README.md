# Simple CLI

Commander like utility to create command-line programs with added support for typescript.

## Install

```
npm i simple-cli
```

## Initialize the object

```js
import {SimpleCLI} from './src';

const program = new SimpleCLI('My Program','1.0.0');
const response = program.parse(process.argv.slice(2), flags, (err) => console.log(err.display));
```

## Flags Object

The flag object will contain definitions of all the commands and flags

```js
const flags = {
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
    alias: '-o',
    flag: '--sauce',
    description: 'sauce',
    argument: true,
  },
};

const response = program.parse(process.argv.slice(2), flags, (err) => console.log(err.display));

// the response object will have all properties of flags attached to it with values

console.lo
```

