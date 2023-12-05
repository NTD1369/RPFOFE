/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { DatasourceEditService } from './datasource-edit.service';

describe('Service: DatasourceEdit', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DatasourceEditService]
    });
  });

  it('should ...', inject([DatasourceEditService], (service: DatasourceEditService) => {
    expect(service).toBeTruthy();
  }));
});
