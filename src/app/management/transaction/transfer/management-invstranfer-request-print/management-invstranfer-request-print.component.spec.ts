/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ManagementInvstranferRequestPrintComponent } from './management-invstranfer-request-print.component';

describe('ManagementInvstranferRequestPrintComponent', () => {
  let component: ManagementInvstranferRequestPrintComponent;
  let fixture: ComponentFixture<ManagementInvstranferRequestPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagementInvstranferRequestPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagementInvstranferRequestPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
