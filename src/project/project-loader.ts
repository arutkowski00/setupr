import * as fs from 'fs';
import { inject, injectable } from 'inversify';
import * as yaml from 'js-yaml';
import { promisify } from 'util';
import { TYPE } from '../ioc/type';
import { FileSystemUtils } from '../utils/file';
import { Project, ProjectValidator } from './';

interface ConfigurationFile {
  extension: string;
  file: string;
}

@injectable()
export class ProjectLoader {
  readonly configurationFileRegex: RegExp;
  readonly configurationParsers = new Map<string, (text: string) => any>([
    ['json', JSON.parse],
    ['yml', (text) => yaml.safeLoad(text)],
  ]);

  constructor(
    @inject(TYPE.ProjectValidator) private readonly validator: ProjectValidator,
    @inject(TYPE.FileSystemUtils) private readonly fsUtils: FileSystemUtils,
  ) {
    this.configurationFileRegex = this.getConfigurationFileRegex();
  }

  async getProjectConfiguration(): Promise<Project> {
    const cwd = process.cwd();
    const configuration = await this.getSingleConfigurationFile(cwd);

    if (!configuration) {
      throw new Error(`No project configuration found in '${cwd}'`);
    }

    const parser = this.configurationParsers.get(configuration.extension);

    if (!parser) {
      throw new Error('Unexpected error: cannot find matching project configuration parser');
    }

    const fileData: string = await this.fsUtils.readFile(configuration.file);
    const parsedFile = parser(fileData);
    const project = await this.validator.validate(parsedFile);

    return project;
  }

  private getConfigurationFileRegex(): RegExp {
    const extensions = Array.from(this.configurationParsers.keys()).join('|');

    return new RegExp(`^setupr\.(${extensions})$`);
  }

  private async getSingleConfigurationFile(directory: string): Promise<ConfigurationFile | undefined> {
    let configuration: ConfigurationFile | undefined;
    const paths: string[] = await this.fsUtils.readDirectoryContents(directory);

    for (const filePath of paths) {
      const match = this.configurationFileRegex.exec(filePath);
      if (match && match.length === 2) {
        if (configuration) {
          throw new Error(`Found more than one project configuration in '${directory}'`);
        }

        configuration = {
          extension: match[1],
          file: filePath,
        };
      }
    }

    return configuration;
  }
}
