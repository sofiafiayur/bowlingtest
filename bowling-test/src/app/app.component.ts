import { Component, OnInit, AfterViewInit, EventEmitter, ViewChild } from '@angular/core';
import { GetRollsDataService, RollData } from './get-rolls-data.service';
import { MatTabChangeEvent, MatTabGroup } from '@angular/material/tabs';

export type FrameType = number | 'strike' | 'spare';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @ViewChild('tab', { static: false }) tab: MatTabGroup | undefined;

  title = 'bowling-test';
  /** Array of pins down number in every roll */
  rollsPinsDown = new Array<number>(21);
  /** Array of every score in frame */
  scores: number[] = [];
  /** Accumulate scores */
  accmltScores: number[] = [];

  loadingA: boolean = true;
  loadingS: boolean = true;
  frames: any[] = [1,2,3,4,5,6,7,8,9,10];
  framesRolls: RollData[] = [];
  manualFrames: RollData[] = [];
  manualScores: FrameType[] = [];
  manualAccmltScores: FrameType[] = [];

  ngOnInit(): void {
    this.refreshRollsSData();
  }
  
  constructor(private rollsDataService: GetRollsDataService) {}

  /**
   * new request to all the rolls data which created automatically
   */
  refreshRollsSData():void {
    this.loadingA = true;
    this.resetUpperData();
    this.rollsDataService.getAllRollsData().subscribe((rollsData: any[]) => {
      if (rollsData && rollsData.length > 0) {
        this.rollsPinsDown = Object.assign({}, rollsData);
        this.calculateFrameScore();
        this.loadingA = false;
      }
    });
  }
  
  private calculateFrameScore() {
      let score = 0;
      let roll = 0
      for (let i = 0; i < 10; i++) {
        if (this.isStrike(roll)) {
          score = 10 + this.strikeBonus(roll+1);
          this.scores.push(score);
          if (this.framesRolls.length === 9) {
            this.framesRolls.push(
              {
                roll1: 10,
                roll2: 0,
                roll3: this.rollsPinsDown[roll + 1],
                roll4: this.rollsPinsDown[roll + 2],
                status: 'strike'
              });
          } else {
            this.framesRolls.push(
              {
                roll1: 10, roll2: 0,
                status: 'strike'
              });
            }
            console.log('isStrike', roll, score);
            roll++;
        } else if (this.isSpare(roll)) {
            score = 10 + this.rollsPinsDown[roll + 2];
            this.scores.push(score);
            if (this.framesRolls.length === 9) {
              this.framesRolls.push(
                {
                  roll1: this.rollsPinsDown[roll],
                  roll2: this.rollsPinsDown[roll + 1],
                  roll3: this.rollsPinsDown[roll + 2],
                  status: 'spare'
                });
              } else {
                this.framesRolls.push(
                  {
                    roll1: this.rollsPinsDown[roll], roll2: this.rollsPinsDown[roll + 1],
                    status: 'spare'
                  });
              }
            console.log('isSpare', roll, score);
            roll += 2;
        } else {
            score = this.summRoll(roll);
            this.scores.push(score);
            this.framesRolls.push({roll1: this.rollsPinsDown[roll], roll2: this.rollsPinsDown[roll + 1]});
            roll += 2;
        }
        this.getAccmltScores();
        // console.log('calculateFrameScore', this.scores, this.accmltScores);
      }
  }

  private isStrike(f: number, manualRoll?: any):boolean {
    if (manualRoll) {
      return manualRoll.roll1 === 10;
    }
    return this.rollsPinsDown[f] === 10;
  }

  private isSpare(f: number, manualRoll?: any):boolean {
    if (manualRoll) {
      return (manualRoll.roll1 + manualRoll.roll2) === 10;
    }
    return this.summRoll(f) === 10;
  }

  private strikeBonus(f: number):number {
      return this.summRoll(f)
  }

  private summRoll(f: number, manual?: boolean):number {
    if (manual) {
      if (this.manualFrames && this.manualFrames[f]) {
        return this.manualFrames[f].roll1 + this.manualFrames[f].roll2;
      }
      return 0;
    }
    let rollPDf = this.rollsPinsDown[f] === undefined ? 0 : this.rollsPinsDown[f];
    let rollPDff = this.rollsPinsDown[f + 1] === undefined ? 0 : this.rollsPinsDown[f + 1];
    return rollPDf + rollPDff;
  }

  /**
   * reset all the upper part data
   */
  private resetUpperData():void {
    this.scores = [];
    this.accmltScores = [];
    this.framesRolls = [];
    this.rollsPinsDown = [];
  }

  /**
   * * The Manually Game Part * *
   */

  /**
   * get the frame data by choosing tab, in the order shown
   * @param index index of tab selected 
   */
  selectedIndexChange(index: number):void {
    this.loadingS = true;
    if (index > 0) {
      this.rollsDataService.getSingleFrame(index).subscribe((frameData: RollData[]) => {
        let i = index -1;
        if (frameData && frameData.length > 0) {
          this.manualFrames = frameData.slice();
            let frame = frameData[i];
            let lastFrame = frameData[i-1];
            if (this.isStrike(i, frame)) {
              if (i === 9) {
                this.rollsDataService.getSingleFrame(11).subscribe((additionalFrame: RollData[]) => {
                  this.manualFrames[9].roll3 = additionalFrame[10].roll1;
                  this.manualFrames[9].roll4 = additionalFrame[10].roll2;
                  this.manualScores[9] = 10 + additionalFrame[10].roll1 + additionalFrame[10].roll2;
                });
              } else {
                this.manualScores[i] ='strike';
              }
              if (lastFrame) {
                if (lastFrame.status !== undefined) {
                  this.manualScores[i-1] = 20;
                  this.getAccmltScores(i - 1);
                }
              }
              frame.status = 'strike';
              this.getAccmltScores(i);
            } else if (this.isSpare(i, frame)) {
              if (i === 9) {
                this.rollsDataService.getSingleFrame(11).subscribe((additionalFrame: RollData[]) => {
                  this.manualFrames[9].roll3 = additionalFrame[10].roll1;
                  this.manualScores[9] = 10 + this.manualFrames[9].roll3;
                });
              } else {
                this.manualScores[i] ='spare';
              }
              if (lastFrame) {
                if (lastFrame.status === 'strike') {
                  this.manualScores[i-1] = 20;
                  this.getAccmltScores(i - 1);
                } else if (lastFrame.status === 'spare') {
                  this.manualScores[i-1] = 10 + frame.roll1
                  this.getAccmltScores(i - 1);
                }
              }
              frame.status = 'spare';
              this.getAccmltScores(i);
            } else {
              let score = frame.roll1 + frame.roll2;
              this.manualScores[i] = score;
              if (lastFrame) {
                if (lastFrame.status === 'strike') {
                  this.manualScores[i-1] = 10 + score;
                  this.getAccmltScores(i - 1);
                } else if (lastFrame.status === 'spare') {
                  this.manualScores[i-1] = 10 + frame.roll1;
                  this.getAccmltScores(i - 1);
                }
              }
              this.getAccmltScores(i);
            }
          this.loadingS = false;
        }
      });
    }
  }

  /**
   * reset the Manually part data
   */
  resetManualData() {
    this.rollsDataService.clearManualData();
    this.manualFrames = [];
    this.manualScores = [];
    this.manualAccmltScores = [];
    if (this.tab !== undefined) {
      this.tab.selectedIndex = 0;
    }
  }
  
  /**
   * calculate the accumulated score for every frame
   * @param i : number
   */
  private getAccmltScores(i?: number): void {
    if (i !== undefined) {
      let currentScores = this.manualScores.slice(0, i+1);
      this.manualAccmltScores[i] = currentScores.reduce((previous: FrameType, current: FrameType) => {
        // console.log('getAccmltScores', i, previous, current, this.manualScores);
        if (typeof(previous) === 'number' && typeof(current) === 'number') {
          return previous + current;
        }
        return current;
      });
    } else {
      let accmltScore = this.scores.reduce((previous: number, current:number) => previous + current);
      this.accmltScores.push(accmltScore);
    }
  }
}
