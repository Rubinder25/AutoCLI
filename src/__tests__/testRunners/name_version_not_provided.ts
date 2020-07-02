import {NodeSimpleCLI} from '../../nodeSimpleCli';
import flags from './flags';

const program = new NodeSimpleCLI();

program.parse(process.argv.slice(2), flags, () => {});
