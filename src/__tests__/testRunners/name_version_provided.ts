import {NodeSimpleCLI} from '../../nodeSimpleCli';
import flags from './flags';

const program = new NodeSimpleCLI('test_runner', '1.0.0');

program.parse(process.argv.slice(2), flags, () => {});
