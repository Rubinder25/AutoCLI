import {SimpleCLI} from '../../simplecli';
// import {FlagsObjectType} from '../../types';
import flags from '../flags';

// type keys = 'source' | 'password';

// const flags: FlagsObjectType<keys> = {
//   source: {
//     alias: '-s',
//     flag: '--source',
//     description: 'source',
//     argument: true,
//   },

//   password: {
//     alias: '-p',
//     flag: '--password',
//     description: 'password',
//     argument: true,
//     showAstrisk: true,
//   },
// };

const program = new SimpleCLI('test_runner', '1.0.0');

program.askQA(flags).then((res) => {
  console.log(res);
  process.exit(0);
});
