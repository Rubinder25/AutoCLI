import {SimpleCLI} from '../../simplecli';
import flags from './flags';

const program = new SimpleCLI('test_runner', '1.0.0');

program.askQA(flags).then((res) => {
  console.log(res);
  process.exit(0);
});
