/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ManagementLoyaltyrankComponent } from './management-loyaltyrank.component';

describe('ManagementLoyaltyrankComponent', () => {
  let component: ManagementLoyaltyrankComponent;
  let fixture: ComponentFixture<ManagementLoyaltyrankComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagementLoyaltyrankComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagementLoyaltyrankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
