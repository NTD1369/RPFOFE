/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ManagementReceiptFromProductionListComponent } from './management-receiptFromProduction-list.component';

describe('ManagementReceiptFromProductionListComponent', () => {
  let component: ManagementReceiptFromProductionListComponent;
  let fixture: ComponentFixture<ManagementReceiptFromProductionListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagementReceiptFromProductionListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagementReceiptFromProductionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
