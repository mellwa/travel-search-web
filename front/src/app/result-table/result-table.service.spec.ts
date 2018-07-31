import { TestBed, inject } from '@angular/core/testing';

import { ResultTableService } from './result-table.service';

describe('ResultTableService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ResultTableService]
    });
  });

  it('should be created', inject([ResultTableService], (service: ResultTableService) => {
    expect(service).toBeTruthy();
  }));
});
