/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ManagementReceiptFromProductionEditComponent } from './management-receiptFromProduction-edit.component';

describe('ManagementReceiptFromProductionEditComponent', () => {
  let component: ManagementReceiptFromProductionEditComponent;
  let fixture: ComponentFixture<ManagementReceiptFromProductionEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagementReceiptFromProductionEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagementReceiptFromProductionEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
