import { Component, OnInit } from '@angular/core';

import { RobotPipettingService, CommandType, Location } from '../services/robot-pipetting.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  noSquaresInEachSide: number = 5;
  noSquares: number = this.noSquaresInEachSide * this.noSquaresInEachSide;
  fakeArray = new Array(this.noSquaresInEachSide);

  plate: Array<Well> = new Array<Well>();

  commands: string = '';

  presentLocation: Location;

  constructor(private service: RobotPipettingService) { }

  ngOnInit() {
    for(let i=0; i < this.noSquaresInEachSide; i++) {
      for(let j=0; j < this.noSquaresInEachSide; j++) {
        this.plate.push(new Well(i, j, false));
      }  
    }
  }

  sample() {
    this.commands = `PLACE 2,2
DROP
MOVE N
DROP
MOVE E`;

    this.process();
  }

  process() {
    let cmd = this.service.parseCommands(this.commands);

    cmd.forEach(cmd => {
      if (cmd) {
        switch(cmd.name) {
          case CommandType.PLACE:
            let location = this.service.parsePlaceArgs(cmd.arguments);
  
            if (location) {
              this.presentLocation = location;
            }
            break;
          case CommandType.DROP:
            let well = this.getWell(this.presentLocation.x, this.presentLocation.y);
  
            well.isFull = true;
            break;
          case CommandType.MOVE:
            let locationAfterMove = this.service.parseMoveArg(this.presentLocation, cmd.arguments);
  
            if (locationAfterMove) {
              this.presentLocation = locationAfterMove;
            }
            break;                      
          default:
            break;          
        }      
      }
    });        
  }

  getWells(y: number) : Array<Well> {
    return this.plate.filter(x => x.y == (y - 1));
  }

  getWell(x: number, y: number) : Well {
    let well = this.plate.find(z => z.x == x && z.y == y);

    if (well)
      return well;

    return null;
  }

}

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
