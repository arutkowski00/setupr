import 'reflect-metadata';
import * as yargs from 'yargs';
import { AppContainer } from './ioc/container';
import { Arguments } from './ioc/interfaces';

const args: Arguments = yargs
  .usage('Usage: $0 <cmd> [options]')
  .help().alias('help', 'h')
  .showHelpOnFail(true)
  .version()
  .command('init <repository>', 'initialize project from repository')
  .demandCommand()
  .argv;

const container = new AppContainer(args);
const command = container.getCommand(args._[0]);
command.execute(args);
