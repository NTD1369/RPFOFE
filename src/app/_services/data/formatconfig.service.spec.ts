/* tslint:disable:no-unused-variable */

import { TestBed, inject, waitForAsync } from '@angular/core/testing';
import { FormatconfigService } from './formatconfig.service';

describe('Service: Formatconfig', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FormatconfigService]
    });
  });

  it('should ...', inject([FormatconfigService], (service: FormatconfigService) => {
    expect(service).toBeTruthy();
  }));
});
