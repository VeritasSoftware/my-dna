import { Injectable } from '@angular/core';
import { Movement, Location, Command, CommandType } from '../models/models';

[Injectable]
export class RobotPipettingService {

    parseCommands(commands: string) : Array<Command> {
        let temp = new Array<Command>();

        //get command lines
        let lines = commands.match(/^.+$/gm);

        //parse each command line
        for (let i=0; i<lines.length; i++) {
            let command = this.parseLine(lines[i]);

            if(command) {
                temp.push(command);
            }
        }

        return temp;
    }

    parseLine(line: string) : Command {
        //PLACE
        let match = line.match(/^(\t|\s)*PLACE\s+(\s*(\d)\s*\,\s*(\d)\s*)(\r\n)*$/i);

        if (match) {
            return new Command(CommandType.PLACE, match[2]);
        }

        //DROP
        match = line.match(/^(\t|\s)*DROP\s*(\r\n)*$/i);

        if (match) {
            return new Command(CommandType.DROP, "");
        }

        //MOVE
        match = line.match(/^(\t|\s)*MOVE\s+([NSWE]{1})\s*(\r\n)*$/i);

        if (match) {
            return new Command(CommandType.MOVE, match[2]);
        }

        return null;
    }

    parsePlaceArgs(args: string) : Location {
        let coords = args.match(/^\s*(\d)\s*\,\s*(\d)\s*$/);

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