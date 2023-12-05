/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { RptInventorySerialComponent } from './rpt-inventory-serial.component';

describe('RptInventorySerialComponent', () => {
  let component: RptInventorySerialComponent;
  let fixture: ComponentFixture<RptInventorySerialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RptInventorySerialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RptInventorySerialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
