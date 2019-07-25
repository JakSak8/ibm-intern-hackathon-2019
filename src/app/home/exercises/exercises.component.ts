import { Component, OnInit } from '@angular/core';
import { Exercise } from './exercise';
import { EmbedVideoService } from 'ngx-embed-video';
import { ExerciseServiceService } from '../exercise-service.service';

@Component({
  selector: 'app-exercises',
  templateUrl: './exercises.component.html',
  styleUrls: ['./exercises.component.scss']
})
export class ExercisesComponent implements OnInit {

  iframe_html: any;
  exercise: Exercise;

  constructor(private embedService: EmbedVideoService, private exerciseService: ExerciseServiceService) {
    this.exercise = this.exerciseService.getExercise(1);
    this.iframe_html = this.embedService.embed(this.exercise.videoLink, {attr: { width: 848, height: 375 }});
  }

  ngOnInit() {
  }
  
}
