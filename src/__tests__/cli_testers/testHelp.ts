import {SimpleCLI} from '../../simplecli';
import flags from '../flags';

const program = new SimpleCLI('test_runner', '1.0.0');

program.parse(process.argv.slice(2), flags, (err) => console.log(err));
