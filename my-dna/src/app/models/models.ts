export class Well {
    x: number;
    y: number;
  
    isFull: boolean = false;
  
    constructor(x: number, y: number, isFull: boolean) {
      this.x = x;
      this.y = y;
      this.isFull = isFull;
    }
  }

export class Command {
    name: CommandType;
    arguments : string;

    constructor(name: CommandType, args: string) {
        this.name = name;
        this.arguments = args;
    }
}

export enum CommandType {
    PLACE,
    DETECT,
    DROP,
    MOVE,
    REPORT
}

export class Location {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

export enum Movement {
    N,
    S,
    E,
    W
}