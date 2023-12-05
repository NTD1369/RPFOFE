/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ShopToolsAssignStaffComponent } from './shop-tools-assign-staff.component';

describe('ShopToolsAssignStaffComponent', () => {
  let component: ShopToolsAssignStaffComponent;
  let fixture: ComponentFixture<ShopToolsAssignStaffComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShopToolsAssignStaffComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShopToolsAssignStaffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
