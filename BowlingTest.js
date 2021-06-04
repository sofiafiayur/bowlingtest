"use strict";
exports.__esModule = true;
exports.Bowling = void 0;
var Bowling = /** @class */ (function () {
    function Bowling() {
        /** Array of pins down number in every roll */
        this.rollsPinsDown = new Array(21);
        /** Array of every score in frame */
        this.scores = [];
        /** Accumulate scores */
        this.accmltScores = [];
        this.currRoll = -1;
    }
    Bowling.prototype.roll = function (pins, i) {
        this.currRoll++;
        this.rollsPinsDown[this.currRoll] = pins,
            console.log('this.rollsPinsDown', this.rollsPinsDown, this.currRoll, i);
    };
    Bowling.prototype.calculateFrameScore = function () {
        var score = 0;
        var frame = 0;
        for (var i = 0; i < 10; i++) {
            if (this.isStrike(frame)) {
                score = 10 + this.strikeBonus(frame + 1);
                this.scores.push(score);
                console.log('isStrike', frame, score);
                frame++;
            }
            else if (this.isSpare(frame)) {
                score = 10 + this.rollsPinsDown[frame + 2];
                this.scores.push(score);
                console.log('isSpare', frame, score);
                frame += 2;
            }
            else {
                score = this.summRoll(frame);
                this.scores.push(score);
                frame += 2;
            }
            var accmltScore = this.scores.reduce(function (previous, current) { return previous + current; });
            this.accmltScores.push(accmltScore);
            console.log('calculateFrameScore', this.scores, this.accmltScores);
        }
    };
    Bowling.prototype.isStrike = function (f) {
        return this.rollsPinsDown[f] === 10;
    };
    Bowling.prototype.isSpare = function (f) {
        return this.summRoll(f) === 10;
    };
    Bowling.prototype.strikeBonus = function (f) {
        return this.summRoll(f);
    };
    Bowling.prototype.summRoll = function (f) {
        if (this.rollsPinsDown[f] && this.rollsPinsDown[f + 1]) {
            return this.rollsPinsDown[f] + this.rollsPinsDown[f + 1];
        }
        else if (!this.rollsPinsDown[f] && !this.rollsPinsDown[f]) {
            return 0;
        }
        else {
            return this.rollsPinsDown[f];
        }
    };
    return Bowling;
}());
exports.Bowling = Bowling;
/** Test Bowling */
var BowlingTest = new Bowling();
function getRandumNumber() {
    return Math.floor(Math.random() * 11);
}
/** Create randum number as number of pins down in every roll to do the test */
for (var i = 0; i < 11; i++) {
    var roll1Pins = getRandumNumber();
    var roll2Pins = getRandumNumber();
    if (roll1Pins === 10) {
        BowlingTest.roll(10, i);
    }
    else if ((roll1Pins + roll2Pins) > 10) {
        roll2Pins = 10 - roll1Pins;
        BowlingTest.roll(roll1Pins, i);
        BowlingTest.roll(roll2Pins, i);
    }
    else {
        BowlingTest.roll(roll1Pins, i);
        BowlingTest.roll(roll2Pins, i);
        if (i === 9) {
            break;
        }
    }
}
BowlingTest.calculateFrameScore();
