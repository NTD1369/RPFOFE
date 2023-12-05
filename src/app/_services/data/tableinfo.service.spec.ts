/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { TableinfoService } from './tableinfo.service';

describe('Service: Tableinfo', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TableinfoService]
    });
  });

  it('should ...', inject([TableinfoService], (service: TableinfoService) => {
    expect(service).toBeTruthy();
  }));
});
