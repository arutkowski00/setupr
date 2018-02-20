import 'reflect-metadata';
import { IMock, It, Mock } from 'typemoq';
import * as TJS from 'typescript-json-schema';
import { AppContainer } from '../../src/ioc/container';
import { TYPE } from '../../src/ioc/type';
import {
  JsonSchemaGenerator,
  JsonSchemaValidatorFactory,
  Project,
  ProjectValidator,
} from '../../src/project';

describe('Project Validator', () => {
  const container = new AppContainer();
  let validator: ProjectValidator;

  beforeAll(() => {
    validator = container.get(TYPE.ProjectValidator);
  });

  test('validate() resolves valid project configuration', () => {
    expect.assertions(1);

    const project: Project = {
      dependencies: ['test123'],
    };

    const result = validator.validate(project);
    expect(result).resolves.toEqual(project);
  });

  test('validate() rejects invalid project configuration', async () => {
    expect.assertions(3);

    const project = {
      dependencies: 123,
    };

    try {
      await validator.validate(project);
    } catch (e) {
      expect(e).toHaveProperty('errors');
      expect(e.errors).toHaveLength(1);
      expect(e.errors[0]).toMatchObject({ dataPath: '.dependencies' });
    }
  });
});
