/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ManagementTransactionDeliveryReturnEditComponent } from './management-transaction-deliveryReturn-edit.component';

describe('ManagementTransactionDeliveryReturnEditComponent', () => {
  let component: ManagementTransactionDeliveryReturnEditComponent;
  let fixture: ComponentFixture<ManagementTransactionDeliveryReturnEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagementTransactionDeliveryReturnEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagementTransactionDeliveryReturnEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
