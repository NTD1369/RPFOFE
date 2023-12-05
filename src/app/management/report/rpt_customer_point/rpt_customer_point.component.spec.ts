/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { Rpt_customer_pointComponent } from './rpt_customer_point.component';

describe('Rpt_customer_pointComponent', () => {
  let component: Rpt_customer_pointComponent;
  let fixture: ComponentFixture<Rpt_customer_pointComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Rpt_customer_pointComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Rpt_customer_pointComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
