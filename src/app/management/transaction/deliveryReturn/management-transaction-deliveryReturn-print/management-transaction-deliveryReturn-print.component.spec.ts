/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ManagementTransactionDeliveryReturnPrintComponent } from './management-transaction-deliveryReturn-print.component';

describe('ManagementTransactionDeliveryReturnPrintComponent', () => {
  let component: ManagementTransactionDeliveryReturnPrintComponent;
  let fixture: ComponentFixture<ManagementTransactionDeliveryReturnPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagementTransactionDeliveryReturnPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagementTransactionDeliveryReturnPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
