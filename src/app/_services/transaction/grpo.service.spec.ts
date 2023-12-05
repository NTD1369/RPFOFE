/* tslint:disable:no-unused-variable */

import { TestBed, inject, waitForAsync } from '@angular/core/testing';
import { GrpoService } from './grpo.service';

describe('Service: Grpo', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GrpoService]
    });
  });

  it('should ...', inject([GrpoService], (service: GrpoService) => {
    expect(service).toBeTruthy();
  }));
});
