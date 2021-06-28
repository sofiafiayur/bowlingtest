import { TestBed } from '@angular/core/testing';

import { GetRollsDataService } from './get-rolls-data.service';

describe('GetRollsDataService', () => {
  let service: GetRollsDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetRollsDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
