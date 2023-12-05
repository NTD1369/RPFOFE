/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ShopApprovalInputComponent } from './shop-approval-input.component';

describe('ShopApprovalInputComponent', () => {
  let component: ShopApprovalInputComponent;
  let fixture: ComponentFixture<ShopApprovalInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShopApprovalInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShopApprovalInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
