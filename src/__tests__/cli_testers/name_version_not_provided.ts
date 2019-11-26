import {SimpleCLI} from '../../simplecli';
import flags from './flags';

const program = new SimpleCLI();
console.log(process.argv);

program.parse(process.argv.slice(2), flags, () => {});
