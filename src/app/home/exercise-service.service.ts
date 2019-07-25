import { Injectable } from '@angular/core';
import { Exercise } from '../home/exercises/exercise';

@Injectable({
  providedIn: 'root'
})
export class ExerciseServiceService {

  constructor() { }

  exerciseArray: Exercise[] = [
    {
      id: 1,
      name: "Warrior Pose",
      sets: 2,
      reps: 3,
      muscleGroup: "Quads, hamstrings and core",
      description: "Yoga pose that resembles a warrior stance. You will feel a stretch in your hamstrings and groin while you quads and core are activated throughout the duration of the pose.",
      videoLink: "https://www.youtube.com/watch?v=Mn6RSIRCV3w"
    }
  ]

  // getExercise(id) {
  //   for(let i = 0; i < this.exerciseArray.length; i++) {
  //     if(this.exerciseArray[i].id == id) {
  //       console.log(this.exerciseArray[i].id);
  //       console.log(this.exerciseArray[i]);
  //       return this.exerciseArray[id];
  //     }
  //   }
  // }

  getExercise(id) {
    return this.exerciseArray[0];
  }
}
