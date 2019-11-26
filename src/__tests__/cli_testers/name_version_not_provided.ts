import {SimpleCLI} from '../../simplecli';
import flags from './flags';

const program = new SimpleCLI();

program.parse(process.argv.slice(2), flags, () => {});
