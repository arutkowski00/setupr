import * as yargs from 'yargs';

export const argvConfig = yargs
  .usage('Usage: $0 <cmd> [options]') // usage string of application.
  .help().alias('help', 'h')
  .showHelpOnFail(true)
  .version()
  .command('init <repository>', 'initialize project from repository')
  .demandCommand();
