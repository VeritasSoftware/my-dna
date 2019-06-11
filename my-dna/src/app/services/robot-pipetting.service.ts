import { Injectable } from '@angular/core';

[Injectable]
export class RobotPipettingService {

    parseCommands(commands: string) : Array<Command> {
        let temp = new Array<Command>();

        let lines = commands.match(/^.+$/gm);

        for (let i=0; i<lines.length; i++) {
            let command = this.parseLine(lines[i]);

            if(command) {
                temp.push(command);
            }
        }

        return temp;
    }

    parseLine(line: string) : Command {
        let match = line.match(/^(\t|\s)*PLACE\s+((\d)\,(\d))(\r\n)*$/i);

        if (match) {
            return new Command(CommandType.PLACE, match[2]);
        }

        match = line.match(/^(\t|\s)*DROP(\r\n)*$/i);

        if (match) {
            return new Command(CommandType.DROP, "");
        }

        match = line.match(/^(\t|\s)*MOVE\s+(.{1})(\r\n)*$/i);

        if (match) {
            return new Command(CommandType.MOVE, match[2]);
        }

        return null;
    }

    parsePlaceArgs(args: string) : Location {
        let coords = args.match(/^(\d)\,(\d)$/);

        if (coords) {
            return new Location(+coords[1], +coords[2])
        }

        return null;
    }

    parseMoveArg(presentLocation: Location, arg: string) : Location {
        arg = arg.toUpperCase();
        switch(Movement[arg]) {
            case Movement.N:
                return new Location(presentLocation.x, presentLocation.y + 1);
            case Movement.E:
                return new Location(presentLocation.x + 1, presentLocation.y);
            case Movement.S:
                return new Location(presentLocation.x, presentLocation.y - 1);
            case Movement.W:
                return new Location(presentLocation.x - 1, presentLocation.y);
            default: 
                return null;
        }
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