/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ManangementLoyaltyrankEditComponent } from './manangement-loyaltyrank-edit.component';

describe('ManangementLoyaltyrankEditComponent', () => {
  let component: ManangementLoyaltyrankEditComponent;
  let fixture: ComponentFixture<ManangementLoyaltyrankEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManangementLoyaltyrankEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManangementLoyaltyrankEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
