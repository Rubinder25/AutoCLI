import {NodeSimpleCLI} from '../../simplecli';
import flags from './flags';

const program = new NodeSimpleCLI('test_runner', '1.0.0');

program.interactive(flags).then((res) => {
  console.log(JSON.stringify(res));
  process.exit(0);
});
