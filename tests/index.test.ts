import 'reflect-metadata';

import { AppContainer } from '../src/ioc/container';
import { Arguments } from '../src/ioc/interfaces';

describe('index', () => {
  it('should pass', () => {
    const container = new AppContainer({} as Arguments);
    expect(container).toBeTruthy();
  });
});
