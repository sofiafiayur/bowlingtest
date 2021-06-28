import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GetRollsDataService {
  currRoll = -1;
  rollsData = new Array<number>(21);
  rollSingleData: RollData[] = [];

  constructor() { }

  /**
   * reset manual frames data
   */
  public clearManualData(): void {
    this.rollSingleData = [];
  }

  /**
   * get the frames data all in one time
   */
  public getAllRollsData(): Observable<any> {
    this.creatAllRollsPins();
    return of(this.rollsData);
  }

  /**
   * get the index frame data by choose the frame
   * @param i 
   */
  public getSingleFrame(i: number): Observable<any> {
    this.createManualFrame(i);
    return of(this.rollSingleData);
  }

  /** Create randum number as number of pins down in every roll to do the test */
  private creatAllRollsPins(): void {
    this.currRoll = -1;
    for (var i = 0; i < 12; i++) {
      let roll1Pins = this.getRandumNumber();
      let roll2Pins = this.getRandumNumber();
      if (roll1Pins === 10) {
          this.roll(10, i);
      } else if ((roll1Pins + roll2Pins) > 9) {
          roll2Pins = 10 - roll1Pins;
          this.roll(roll1Pins, i);
          this.roll(roll2Pins, i);
          if (i === 10) { break; }
      } else {
          this.roll(roll1Pins, i);
          this.roll(roll2Pins, i);
          if (i === 9) { break; }
      }
    }
  }

  private createManualFrame(i: number): void {
    let roll1 = this.getRandumNumber();
    let roll2 = this.getRandumNumber();
    if (roll1 === 10) {
      this.manualRoll(i, roll1, 0);
    } else if ((roll1 + roll2) > 9) {
      roll2 = 10 - roll1;
      this.manualRoll(i, roll1, roll2);
    } else {
      this.manualRoll(i, roll1, roll2);
    }
  }

  private manualRoll(i: number, roll1: number, roll2: number): void {
    if (i > 0) {
      this.rollSingleData[i-1] = {roll1: roll1, roll2: roll2};
    }
  }

  private getRandumNumber():number {
    return Math.floor(Math.random() * 11);
  }

  private roll(pins: number, i: number): void {
    this.currRoll++;
    this.rollsData[this.currRoll] = pins;
  }
}

export interface RollData {
  roll1: number,
  roll2: number,
  roll3?: number,
  roll4?: number,
  status?: 'strike' | 'spare';
}
