/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ManagementTransactionGoodreceiptEditComponent } from './management-transaction-goodreceipt-edit.component';

describe('ManagementTransactionGoodreceiptEditComponent', () => {
  let component: ManagementTransactionGoodreceiptEditComponent;
  let fixture: ComponentFixture<ManagementTransactionGoodreceiptEditComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagementTransactionGoodreceiptEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagementTransactionGoodreceiptEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
