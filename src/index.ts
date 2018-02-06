import 'reflect-metadata';
import { argvConfig } from './config/argv.config';
import { AppContainer } from './ioc';

const args = argvConfig.argv;
const container = new AppContainer(args);
const command = container.getCommand(args._[0]);
command.execute(args);
