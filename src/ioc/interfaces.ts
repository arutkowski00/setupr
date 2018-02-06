export interface IArguments {
  /** Non-option arguments */
  _: string[];
  /** The script name or node command */
  $0: string;
  repository?: string;
}

export interface ICommand {
  execute(argv: IArguments): void;
}

export interface ITask {
  title: string;
  enabled?(ctx: any): boolean;
  skip?(ctx: any): any;
  task(): any;
}
