import { Container, ContainerModule, interfaces } from 'inversify';

import { InitCommand } from '../commands';
import { DummyTask } from '../tasks';
import { IArguments, ICommand, ITask, TYPE } from './';

interface INewableCollection<T> {
  [key: string]: { new(): T };
}

export class AppContainer extends Container {
  readonly commands: INewableCollection<ICommand> = {
    init: InitCommand,
  };
  readonly tasks: INewableCollection<ITask> = {
    dummy: DummyTask,
  };
  readonly thirdPartyDependencies: ContainerModule;
  readonly appDependencies: ContainerModule;

  constructor(args: IArguments) {
    super();
    this.thirdPartyDependencies = new ContainerModule((bind) => {
      // nothing
    });

    this.appDependencies = new ContainerModule((bind) => {
      bind<IArguments>(TYPE.Arguments).toConstantValue(args);
      this.bindCommands(bind);
      this.bindTasks(bind);
    });

    this.load(this.thirdPartyDependencies, this.appDependencies);
  }

  getCommand(name: string): ICommand {
    return this.getNamed<ICommand>(TYPE.Command, name);
  }

  private bindCommands(bind: interfaces.Bind) {
    for (const commandKey in this.commands) {
      if (this.commands.hasOwnProperty(commandKey)) {
        const command = this.commands[commandKey];
        bind<ICommand>(TYPE.Command).to(command).whenTargetNamed(commandKey);
      }
    }
  }

  private bindTasks(bind: interfaces.Bind) {
    for (const taskKey in this.tasks) {
      if (this.tasks.hasOwnProperty(taskKey)) {
        const task = this.tasks[taskKey];
        bind<ITask>(TYPE.Task).to(task).whenTargetNamed(taskKey);
      }
    }
  }
}
