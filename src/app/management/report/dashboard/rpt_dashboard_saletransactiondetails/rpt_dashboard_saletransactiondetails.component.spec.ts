/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { Rpt_dashboard_saletransactiondetailsComponent } from './rpt_dashboard_saletransactiondetails.component';

describe('Rpt_dashboard_saletransactiondetailsComponent', () => {
  let component: Rpt_dashboard_saletransactiondetailsComponent;
  let fixture: ComponentFixture<Rpt_dashboard_saletransactiondetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Rpt_dashboard_saletransactiondetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Rpt_dashboard_saletransactiondetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
