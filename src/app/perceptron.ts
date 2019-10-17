import {Injectable} from '@angular/core';
import * as R from 'ramda';
import {Observable, of} from 'rxjs';

@Injectable()
export class Perceptron {
  /* The range for x, y coordinates x:0-X_MAX, y:0-Y_MAX */
  private X_MAX = 400;
  private Y_MAX = 400;

  /* Initial 'Untrained' weights */
  private initialWeight = ({
    x: this.rand(-1, 1),
    y: this.rand(-1, 1)
  });

  /* Trained Weight */
  private trainedWeight = null;

  constructor(xMax: number, yMax) {
    this.X_MAX = xMax;
    this.Y_MAX = yMax;
  }

  /* train method - accepts number of training steps */
  train(num): Observable<any> {

    /* adjust the results during training for each point in training points */
    const trainPoint = (weight, point, team) => {
      const guessResult = this.guess(weight, point); // take a guess
      const error = team - guessResult; // calculate error (actual team - guess)
      const learningRate = 0.01; // learning rate constant, value may differ from case to case for ML
      // Calculate adjusted weight
      return {
        x: weight.x + point.x * error * learningRate,
        y: weight.y + point.y * error * learningRate,
      };
    };

    const trainingPoints = this.generatePoints(num).map(point => ({
      point,
      team: this.team(point) // actual correct value
    }));

    let currentWeight = this.initialWeight;
    for (const item of trainingPoints) {
      currentWeight = trainPoint(currentWeight, item.point, item.team);
      // await this.sleep(100);
      // yield currentWeights
    }
    this.trainedWeight = currentWeight;
    return of(currentWeight);
  }

  /* Guess -1 or 1 based on input values */
  private guess(weight, point) {
    const sum =
      point.x * weight.x +
      point.y * weight.y;
    return sum >= 0 ? 1 : -1;
  }

  /* identify to which team point belongs - in a way this is the 'activate function' */
  private team(point) {
    return point.x > point.y ? 1 : -1;
  }

  /* generates array of points {x, y}, length = num */
  generatePoints(num) {
    return R.range(1, num).map(_ => ({
      x: this.rand(0, this.X_MAX),
      y: this.rand(0, this.Y_MAX)
    }));
  }

  /* generates random number in range high-low */
  private rand(high, low) {
    return Math.random() * (high - low) + low;
  }

  private sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /* Helper method for color identify */
  teamColor(point): string {
    return this.guess(this.trainedWeight, point) === -1 ? 'blue' : 'red';
  }
}
