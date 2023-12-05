/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ManagementReceiptFromProductionPrintComponent } from './management-receiptFromProduction-print.component';

describe('ManagementReceiptFromProductionPrintComponent', () => {
  let component: ManagementReceiptFromProductionPrintComponent;
  let fixture: ComponentFixture<ManagementReceiptFromProductionPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagementReceiptFromProductionPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagementReceiptFromProductionPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
