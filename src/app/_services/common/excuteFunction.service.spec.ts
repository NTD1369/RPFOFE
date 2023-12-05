/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ExcuteFunctionService } from './excuteFunction.service';

describe('Service: ExcuteFunction', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ExcuteFunctionService]
    });
  });

  it('should ...', inject([ExcuteFunctionService], (service: ExcuteFunctionService) => {
    expect(service).toBeTruthy();
  }));
});
