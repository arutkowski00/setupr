import { inject, injectable } from 'inversify';
import { Arguments, Command } from '../ioc/interfaces';
import { TYPE } from '../ioc/type';
import { ProjectLoader } from '../project';

@injectable()
export class InitCommand implements Command {
  constructor(
    @inject(TYPE.ProjectLoader) private readonly projectLoader: ProjectLoader,
  ) {}

  execute(argv: Arguments): void {
    this.projectLoader.getProjectConfiguration()
    .then(project => {
      console.log(project);
    })
    .catch(reason => {
      console.error(reason);
    })
  }
}
