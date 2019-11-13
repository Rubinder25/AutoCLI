import {execSync} from 'child_process';
import flags from './flags';

function cmd(command: string): string {
  let out = '';
  try {
    out = String(execSync(command));
  } catch (e) {
    console.log('An error had occurred while processing the command');
  }
  return out;
}

