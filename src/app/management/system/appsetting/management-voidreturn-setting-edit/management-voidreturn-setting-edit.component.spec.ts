/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ManagementVoidreturnSettingEditComponent } from './management-voidreturn-setting-edit.component';

describe('ManagementVoidreturnSettingEditComponent', () => {
  let component: ManagementVoidreturnSettingEditComponent;
  let fixture: ComponentFixture<ManagementVoidreturnSettingEditComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagementVoidreturnSettingEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagementVoidreturnSettingEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
