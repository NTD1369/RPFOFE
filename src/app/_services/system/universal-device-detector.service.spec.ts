/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { UniversalDeviceDetectorService } from './universal-device-detector.service';

describe('Service: UniversalDeviceDetector', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UniversalDeviceDetectorService]
    });
  });

  it('should ...', inject([UniversalDeviceDetectorService], (service: UniversalDeviceDetectorService) => {
    expect(service).toBeTruthy();
  }));
});
