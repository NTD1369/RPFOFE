/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { SalesChannelService } from './sales-channel.service';

describe('Service: SalesChannel', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SalesChannelService]
    });
  });

  it('should ...', inject([SalesChannelService], (service: SalesChannelService) => {
    expect(service).toBeTruthy();
  }));
});
