import * as Ajv from 'ajv';
import { Container, ContainerModule, interfaces } from 'inversify';
import * as TJS from 'typescript-json-schema';

import { InitCommand } from '../commands';
import { JsonSchemaGenerator, JsonSchemaValidatorFactory, ProjectLoader, ProjectValidator } from '../project';
import { DummyTask } from '../tasks';
import { FileSystemUtils } from '../utils/file';
import { Arguments, Command, Task } from './interfaces';
import { TYPE } from './type';

interface NewableCollection<T> {
  [key: string]: { new(...args: any[]): T };
}

export class AppContainer extends Container {
  readonly commands: NewableCollection<Command> = {
    init: InitCommand,
  };
  readonly tasks: NewableCollection<Task> = {
    dummy: DummyTask,
  };
  readonly thirdPartyDependencies: ContainerModule;
  readonly appDependencies: ContainerModule;

  constructor(args?: Arguments) {
    super();
    this.thirdPartyDependencies = new ContainerModule((bind) => {
      bind<JsonSchemaValidatorFactory>(TYPE.JsonSchemaValidatorFactory)
        .toFactory((): JsonSchemaValidatorFactory => {
          return (options) => new Ajv(options);
        });
      bind<JsonSchemaGenerator>(TYPE.JsonSchemaGenerator)
        .toConstantValue(TJS);
    });

    this.appDependencies = new ContainerModule((bind) => {
      if (args) {
        bind<Arguments>(TYPE.Arguments).toConstantValue(args);
      }

      bind<FileSystemUtils>(TYPE.FileSystemUtils).to(FileSystemUtils).inSingletonScope();
      bind<ProjectLoader>(TYPE.ProjectLoader).to(ProjectLoader);
      bind<ProjectValidator>(TYPE.ProjectValidator).to(ProjectValidator);

      this.bindCommands(bind);
      this.bindTasks(bind);
    });

    this.load(this.thirdPartyDependencies, this.appDependencies);
  }

  getCommand(name: string): Command {
    return this.getNamed<Command>(TYPE.Command, name);
  }

  private bindCommands(bind: interfaces.Bind) {
    for (const commandKey of Object.keys(this.commands)) {
      const command = this.commands[commandKey];
      bind<Command>(TYPE.Command).to(command).whenTargetNamed(commandKey);
    }
  }

  private bindTasks(bind: interfaces.Bind) {
    for (const taskKey of Object.keys(this.tasks)) {
      const task = this.tasks[taskKey];
      bind<Task>(TYPE.Task).to(task).whenTargetNamed(taskKey);
    }
  }
}
