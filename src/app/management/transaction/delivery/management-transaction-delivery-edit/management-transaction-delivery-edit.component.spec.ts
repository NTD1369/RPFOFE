/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ManagementTransactionDeliveryEditComponent } from './management-transaction-delivery-edit.component';

describe('ManagementTransactionDeliveryEditComponent', () => {
  let component: ManagementTransactionDeliveryEditComponent;
  let fixture: ComponentFixture<ManagementTransactionDeliveryEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagementTransactionDeliveryEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagementTransactionDeliveryEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
