export interface Arguments {
  /** Non-option arguments */
  _: string[];
  /** The script name or node command */
  $0: string;
  repository?: string;
}

export interface Command {
  execute(argv: Arguments): void;
}

export interface Task {
  title: string;
  enabled?(ctx: any): boolean;
  skip?(ctx: any): any;
  task(): any;
}
