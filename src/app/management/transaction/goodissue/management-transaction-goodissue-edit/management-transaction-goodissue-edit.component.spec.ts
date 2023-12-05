/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ManagementTransactionGoodissueEditComponent } from './management-transaction-goodissue-edit.component';

describe('ManagementTransactionGoodissueEditComponent', () => {
  let component: ManagementTransactionGoodissueEditComponent;
  let fixture: ComponentFixture<ManagementTransactionGoodissueEditComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagementTransactionGoodissueEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagementTransactionGoodissueEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
