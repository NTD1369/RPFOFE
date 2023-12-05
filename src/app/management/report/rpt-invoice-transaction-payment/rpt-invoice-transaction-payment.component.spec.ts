/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { RptInvoiceTransactionPaymentComponent } from './rpt-invoice-transaction-payment.component';

describe('RptInvoiceTransactionPaymentComponent', () => {
  let component: RptInvoiceTransactionPaymentComponent;
  let fixture: ComponentFixture<RptInvoiceTransactionPaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RptInvoiceTransactionPaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RptInvoiceTransactionPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
