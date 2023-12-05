/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagementInvtranfeReceiptPrintComponent } from './management-invstranfer-receipt-print.component';

describe('ManagementInventoryPostingPrintComponent', () => {
  let component: ManagementInvtranfeReceiptPrintComponent;
  let fixture: ComponentFixture<ManagementInvtranfeReceiptPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ManagementInvtranfeReceiptPrintComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagementInvtranfeReceiptPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
