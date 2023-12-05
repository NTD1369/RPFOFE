/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagementGoodReceiptPrintComponent } from './management-transaction-goodreceipt-print.component';

describe('ManagementEndofdatePrintComponent', () => {
  let component: ManagementGoodReceiptPrintComponent;
  let fixture: ComponentFixture<ManagementGoodReceiptPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ManagementGoodReceiptPrintComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagementGoodReceiptPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
