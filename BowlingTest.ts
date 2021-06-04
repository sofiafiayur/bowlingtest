export class Bowling {
    /** Array of pins down number in every roll */
    rollsPinsDown = new Array<number>(21);
    /** Array of every score in frame */
    scores = [];
    /** Accumulate scores */
    accmltScores = [];
    currRoll = -1;
    public roll(pins: number,i: number): void {
        this.currRoll++;
        this.rollsPinsDown[this.currRoll] = pins,
        console.log('this.rollsPinsDown',this.rollsPinsDown, this.currRoll, i);
    }

    public calculateFrameScore() {
        let score = 0;
        let frame = 0
        for (var i = 0; i < 10; i++) {
            if (this.isStrike(frame)) {
                score = 10 + this.strikeBonus(frame+1);
                this.scores.push(score);
                console.log('isStrike', frame, score);
                frame++;
            } else if (this.isSpare(frame)) {
                score = 10 + this.rollsPinsDown[frame + 2];
                this.scores.push(score);
                console.log('isSpare', frame, score);
                frame += 2;
            } else {
                score = this.summRoll(frame);
                this.scores.push(score);
                frame += 2;
            }
            let accmltScore = this.scores.reduce((previous: number, current:number) => previous + current)
            this.accmltScores.push(accmltScore);
            console.log('calculateFrameScore', this.scores, this.accmltScores);
        }
    }
    private isStrike(f: number):boolean {
        return this.rollsPinsDown[f] === 10;
    }
    private isSpare(f: number):boolean {
        return this.summRoll(f) === 10;
    }
    private strikeBonus(f: number):number {
        return this.summRoll(f)
    }
    private summRoll(f: number):number {
        if (this.rollsPinsDown[f] && this.rollsPinsDown[f+1]) {
            return this.rollsPinsDown[f] + this.rollsPinsDown[f+1];
        } else if (!this.rollsPinsDown[f] && !this.rollsPinsDown[f]) {
            return 0;
        } else {
            return this.rollsPinsDown[f];
        }
    }

}

/** Test Bowling */
let BowlingTest = new Bowling();
function getRandumNumber():number {
    return Math.floor(Math.random() * 11);
}
/** Create randum number as number of pins down in every roll to do the test */
for (var i = 0; i < 11; i++) {
    let roll1Pins = getRandumNumber();
    let roll2Pins = getRandumNumber();
    if (roll1Pins === 10) {
        BowlingTest.roll(10, i);
    } else if ((roll1Pins + roll2Pins) > 10) {
        roll2Pins = 10 - roll1Pins;
        BowlingTest.roll(roll1Pins, i);
        BowlingTest.roll(roll2Pins, i);
    } else {
        BowlingTest.roll(roll1Pins, i);
        BowlingTest.roll(roll2Pins, i);
        if (i === 9) {
            break;
        }
    }
}
BowlingTest.calculateFrameScore();


