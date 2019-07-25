import { TestBed } from '@angular/core/testing';

import { DemoUtilService } from './demo-util.service';

describe('DemoUtilService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DemoUtilService = TestBed.get(DemoUtilService);
    expect(service).toBeTruthy();
  });
});
