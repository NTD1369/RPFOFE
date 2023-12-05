/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ManagementMasterdataStoreareaComponent } from './management-masterdata-storearea.component';

describe('ManagementMasterdataStoreareaComponent', () => {
  let component: ManagementMasterdataStoreareaComponent;
  let fixture: ComponentFixture<ManagementMasterdataStoreareaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagementMasterdataStoreareaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagementMasterdataStoreareaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
