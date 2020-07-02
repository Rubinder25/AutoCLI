import {SimpleCLI} from '../../simplecli';

const flags = {
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

const program = new SimpleCLI('test_runner', '1.0.0');

program.parse(process.argv.slice(2), flags, () => {});
