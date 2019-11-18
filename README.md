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



