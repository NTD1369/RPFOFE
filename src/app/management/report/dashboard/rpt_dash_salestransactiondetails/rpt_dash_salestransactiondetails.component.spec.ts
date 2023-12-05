/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { Rpt_dash_salestransactiondetailsComponent } from './rpt_dash_salestransactiondetails.component';

describe('Rpt_dash_salestransactiondetailsComponent', () => {
  let component: Rpt_dash_salestransactiondetailsComponent;
  let fixture: ComponentFixture<Rpt_dash_salestransactiondetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Rpt_dash_salestransactiondetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Rpt_dash_salestransactiondetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
