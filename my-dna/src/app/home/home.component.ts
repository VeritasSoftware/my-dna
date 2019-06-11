import { Component, OnInit } from '@angular/core';

import { RobotPipettingService, CommandType, Location } from '../services/robot-pipetting.service';

const DEFAULT_NO_OF_WELLS_PER_SIDE: string = "5";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  noSquaresInEachSide: string = DEFAULT_NO_OF_WELLS_PER_SIDE;
  noSquares: number;
  fakeArray: any[];

  plate: Array<Well> = new Array<Well>();

  commands: string = '';

  presentLocation: Location;

  constructor(private service: RobotPipettingService) { }

  ngOnInit() {
    this.noSquaresInEachSide = DEFAULT_NO_OF_WELLS_PER_SIDE;
    this.setWellsPerSide();
  }

  setWellsPerSide() {
    this.commands = '';
    this.presentLocation = null;
    if (this.noSquaresInEachSide && +this.noSquaresInEachSide > 0) {
      this.noSquares = +this.noSquaresInEachSide * +this.noSquaresInEachSide; 
      this.bind();
    }        
    else {
      this.noSquaresInEachSide = "";
    }
  }

  bind() {
    this.plate = new Array<Well>();

    for(let i=0; i < +this.noSquaresInEachSide; i++) {
      for(let j=0; j < +this.noSquaresInEachSide; j++) {
        this.plate.push(new Well(i, j, false));
      }  
    }

    this.fakeArray = new Array(+this.noSquaresInEachSide);
  }

  sample() {
    this.commands = `PLACE 2,2
DROP
MOVE N
DROP
MOVE E`;

    this.process();
  }

  clear(clearCommands: boolean = true) {
    if (clearCommands) {
      this.commands = '';
    }    
    this.presentLocation = null;
    this.bind();
  }

  process() {    
    this.clear(false);

    let cmd = this.service.parseCommands(this.commands);

    let isPlaced: boolean = false;

    cmd.forEach(cmd => {
      if (cmd) {
        switch(cmd.name) {
          case CommandType.PLACE:
            let location = this.service.parsePlaceArgs(cmd.arguments);
  
            if (location && this.isInBounds(location.x, location.y, +this.noSquaresInEachSide)) {
              this.presentLocation = location;
              isPlaced = true;
            }
            break;
          case CommandType.DROP:
            if (isPlaced) {
              let well = this.getWell(this.presentLocation.x, this.presentLocation.y);
  
              well.isFull = true;
            }            
            break;
          case CommandType.MOVE:
            if (isPlaced) {
              let locationAfterMove = this.service.parseMoveArg(this.presentLocation, cmd.arguments);
  
              if (locationAfterMove && this.isInBounds(locationAfterMove.x, locationAfterMove.y, +this.noSquaresInEachSide)) {
                this.presentLocation = locationAfterMove;
              }
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

  isInBounds(x: number, y: number, noOfWellsPerSide: number) : boolean {
    return (x >= 0 && x < noOfWellsPerSide) && (y >= 0 && y < noOfWellsPerSide);
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
