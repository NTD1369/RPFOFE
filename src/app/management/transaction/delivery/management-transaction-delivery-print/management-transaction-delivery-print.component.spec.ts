/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ManagementTransactionDeliveryPrintComponent } from './management-transaction-delivery-print.component';

describe('ManagementTransactionDeliveryPrintComponent', () => {
  let component: ManagementTransactionDeliveryPrintComponent;
  let fixture: ComponentFixture<ManagementTransactionDeliveryPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagementTransactionDeliveryPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagementTransactionDeliveryPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
