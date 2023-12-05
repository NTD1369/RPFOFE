/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagementInventoryTransferPrintComponent } from './management-inventory-transfer-print.component';

describe('ManagementInventoryTransferPrintComponent', () => {
  let component: ManagementInventoryTransferPrintComponent;
  let fixture: ComponentFixture<ManagementInventoryTransferPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ManagementInventoryTransferPrintComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagementInventoryTransferPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
