import { injectable } from 'inversify';
import { Task } from '../ioc/interfaces';

@injectable()
export class DummyTask implements Task {
  title: string = 'Dummy task';

  task() {
    throw new Error('Method not implemented.');
  }
}
