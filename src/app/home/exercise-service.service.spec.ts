import { TestBed } from '@angular/core/testing';

import { ExerciseServiceService } from './exercise-service.service';

describe('ExerciseServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ExerciseServiceService = TestBed.get(ExerciseServiceService);
    expect(service).toBeTruthy();
  });
});
