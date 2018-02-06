import { injectable } from 'inversify';

import { IArguments, ICommand } from '../ioc';

@injectable()
export class InitCommand implements ICommand {
  execute(argv: IArguments): void {
    throw new Error('Method not implemented.');
  }
}
