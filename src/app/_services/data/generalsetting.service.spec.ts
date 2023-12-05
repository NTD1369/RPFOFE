/* tslint:disable:no-unused-variable */

import { TestBed, inject, waitForAsync } from '@angular/core/testing';
import { GeneralsettingService } from './generalsetting.service';

describe('Service: Generalsetting', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GeneralsettingService]
    });
  });

  it('should ...', inject([GeneralsettingService], (service: GeneralsettingService) => {
    expect(service).toBeTruthy();
  }));
});
