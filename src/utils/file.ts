import * as fs from 'fs';
import { injectable } from 'inversify';
import { promisify } from 'util';

@injectable()
export class FileSystemUtils {
  readDirectoryContents(path: string): Promise<string[]> {
    return promisify(fs.readdir)(path);
  }

  readFile(path: string, encoding = 'utf8'): Promise<string> {
    return promisify(fs.readFile)(path, encoding);
  }
}
