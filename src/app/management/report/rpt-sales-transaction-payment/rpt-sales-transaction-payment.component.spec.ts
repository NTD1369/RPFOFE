/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { RptSalesTransactionPaymentComponent } from './rpt-sales-transaction-payment.component';

describe('RptSalesTransactionPaymentComponent', () => {
  let component: RptSalesTransactionPaymentComponent;
  let fixture: ComponentFixture<RptSalesTransactionPaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RptSalesTransactionPaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RptSalesTransactionPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
