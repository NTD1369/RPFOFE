/* tslint:disable:no-unused-variable */

import { TestBed, inject, waitForAsync } from '@angular/core/testing';
import { FunctionService } from './function.service';

describe('Service: Function', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FunctionService]
    });
  });

  it('should ...', inject([FunctionService], (service: FunctionService) => {
    expect(service).toBeTruthy();
  }));
});
