import 'reflect-metadata';

import { AppContainer } from '../src/ioc/container';
import { IArguments } from '../src/ioc/interfaces';

describe('index', () => {
  it('should pass', () => {
    const container = new AppContainer({} as IArguments);
    expect(container).toBeTruthy();
  });
});
