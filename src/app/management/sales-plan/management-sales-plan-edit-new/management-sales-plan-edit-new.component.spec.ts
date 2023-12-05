/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ManagementSalesPlanEditNewComponent } from './management-sales-plan-edit-new.component';

describe('ManagementSalesPlanEditNewComponent', () => {
  let component: ManagementSalesPlanEditNewComponent;
  let fixture: ComponentFixture<ManagementSalesPlanEditNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagementSalesPlanEditNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagementSalesPlanEditNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
