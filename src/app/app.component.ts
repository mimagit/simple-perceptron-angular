import {Component, OnInit} from '@angular/core';
import {Perceptron} from './perceptron';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'neural';

  X_MAX = 400;
  Y_MAX = 400;

  perceptron: Perceptron;
  points = [];

  trainingInProgress: boolean;
  numOfTrainingSteps = 50;
  trainedWeight = null;


  constructor() {
    this.perceptron = new Perceptron(this.X_MAX, this.Y_MAX);
  }

  ngOnInit(): void {
  }

  train(numOfTrainSteps) {
    console.log('start');
    this.trainingInProgress = true;
    this.trainedWeight = null;

    this.perceptron.train(numOfTrainSteps).subscribe((trainedWeight) => {
      this.trainedWeight = trainedWeight;
      console.log('end', this.trainedWeight);
      this.trainingInProgress = false;
    });
  }

  generatePoints() {
    this.points = this.perceptron.generatePoints(100);
  }

  teamColor(point) {
    return this.perceptron.teamColor(point);
  }
}
