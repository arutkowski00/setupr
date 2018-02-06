import { injectable } from 'inversify';
import { ITask } from '../ioc';

@injectable()
export class DummyTask implements ITask {
  title: string = 'Dummy task';

  task() {
    throw new Error('Method not implemented.');
  }
}
