import * as ajv from 'ajv';
import { inject, injectable } from 'inversify';
import { resolve } from 'path';

import { TYPE } from '../ioc/type';
import { Project } from './project';
import { JsonSchemaGenerator, JsonSchemaValidatorFactory } from './types';

import * as metaSchema from 'ajv/lib/refs/json-schema-draft-04.json';

@injectable()
export class ProjectValidator {
  readonly schemaValidator: ajv.Ajv;
  readonly validateFunc: ajv.ValidateFunction;

  constructor(
    @inject(TYPE.JsonSchemaGenerator) schemaGenerator: JsonSchemaGenerator,
    @inject(TYPE.JsonSchemaValidatorFactory) schemaValidatorFactory: JsonSchemaValidatorFactory,
  ) {
    const program = schemaGenerator.getProgramFromFiles([resolve(__dirname, 'project.ts')]);
    const schema = schemaGenerator.generateSchema(program, 'Project');
    if (schema) {
      (schema as any).$async = true;
    }

    if (!schema) {
      throw new Error('Cannot generate schema for project configuration!');
    }

    this.schemaValidator = schemaValidatorFactory({
      async: true,
      schemaId: 'auto',
    });
    this.schemaValidator.addMetaSchema(metaSchema);
    this.validateFunc = this.schemaValidator.compile(schema);
  }

  validate(obj: object): Promise<Project> {
    const promiseOrBoolean = this.validateFunc(obj);

    if (typeof promiseOrBoolean === 'boolean') {
      return promiseOrBoolean === true ? Promise.resolve(obj) : Promise.reject(this.validateFunc.errors);
    } else {
      return promiseOrBoolean as Promise<Project>;
    }
  }
}
