import * as ajv from 'ajv';
import * as TJS from 'typescript-json-schema';

export type JsonSchemaGenerator = typeof TJS;
export type JsonSchemaValidatorFactory = (options?: ajv.Options) => ajv.Ajv;
